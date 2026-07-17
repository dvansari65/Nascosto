import { Server } from "socket.io";
import { ethers } from "ethers";
import { PrismaClient } from "@prisma/client";
import { getMarketplaceContract, getShadowCardContract, getPublicProvider } from "./contracts";
import { toPreviewSrc } from "./helpers/preview";
import http from "http";

const prisma = new PrismaClient();
const server = http.createServer();
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

async function fetchPinataMetadata(uri: string) {
  try {
    const url = toPreviewSrc(uri);
    // Remove optimization params for metadata fetch if any, but toPreviewSrc with no opts returns gateway URL.
    const response = await fetch(url);
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error("Error fetching metadata:", error);
    return null;
  }
}

async function startIndexer() {
  console.log("Starting Indexer & WebSocket server...");

  const provider = getPublicProvider();

  // We need an ethers instance to listen to events
  const marketplace = getMarketplaceContract(provider);
  const shadowCard = getShadowCardContract(provider);

  if (!marketplace || !shadowCard) {
    console.error("Contracts not configured.");
    return;
  }

  // Socket.io connections
  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);
    socket.on("disconnect", () => console.log("Client disconnected:", socket.id));
  });

  // Listen to CardListed
  marketplace.on("CardListed", async (nftContract, tokenId, seller, encryptedPriceHandle, event) => {
    try {
      console.log(`CardListed: ${tokenId} by ${seller}`);
      const tId = Number(tokenId);

      // Upsert Listing
      const listing = await prisma.listing.upsert({
        where: { tokenId: tId },
        update: {
          seller,
          encryptedPriceHandle,
          status: "Listed"
        },
        create: {
          tokenId: tId,
          seller,
          encryptedPriceHandle,
          status: "Listed"
        }
      });

      io.emit("CardListed", listing);
    } catch (e) {
      console.error("Error processing CardListed:", e);
    }
  });

  // Listen to CardDelisted
  marketplace.on("CardDelisted", async (nftContract, tokenId, event) => {
    try {
      console.log(`CardDelisted: ${tokenId}`);
      const tId = Number(tokenId);

      const listing = await prisma.listing.updateMany({
        where: { tokenId: tId },
        data: { status: "Delisted" }
      });

      io.emit("CardDelisted", listing);
    } catch (e) {
      console.error("Error processing CardDelisted:", e);
    }
  });

  // Listen to OfferSubmitted
  marketplace.on("OfferSubmitted", async (nftContract, tokenId, buyer, encryptedAmountHandle, event) => {
    try {
      console.log(`OfferSubmitted: ${tokenId} by ${buyer}`);
      const tId = Number(tokenId);

      const offer = await prisma.offer.upsert({
        where: {
          tokenId_buyer: {
            tokenId: tId,
            buyer: buyer
          }
        },
        update: {
          encryptedAmountHandle,
          status: "Pending"
        },
        create: {
          tokenId: tId,
          buyer,
          encryptedAmountHandle,
          status: "Pending"
        }
      });

      io.emit("OfferSubmitted", offer);
    } catch (e) {
      console.error("Error processing OfferSubmitted:", e);
    }
  });

  // Listen to OfferAccepted
  marketplace.on("OfferAccepted", async (nftContract, tokenId, buyer, event) => {
    try {
      console.log(`OfferAccepted: ${tokenId} to ${buyer}`);
      const tId = Number(tokenId);

      const listing = await prisma.listing.updateMany({
        where: { tokenId: tId },
        data: { status: "Sold" }
      });

      const offer = await prisma.offer.updateMany({
        where: {
          tokenId: tId,
          buyer: buyer
        },
        data: { status: "Accepted" }
      });

      io.emit("OfferAccepted", { listing, offer });
    } catch (e) {
      console.error("Error processing OfferAccepted:", e);
    }
  });

  // Listen to CardMinted — creates the Card row with full metadata
  shadowCard.on("CardMinted", async (tokenId, mintedBy, contentHash, event) => {
    const tId = Number(tokenId);
    try {
      const tId = Number(tokenId);
      console.log(`CardMinted: ${tId} (minted by ${mintedBy})`);

      const tokenURI = await (shadowCard as any).tokenURI(tokenId);
      // Real owner isn't in this event — mintedBy is whoever called mintCard,
      // not the recipient. _safeMint already ran before this event fires,
      // so ownerOf() is reliable here.
      const owner = await (shadowCard as any).ownerOf(tokenId);
      const metadata = await fetchPinataMetadata(tokenURI);

      const card = await prisma.card.create({
        data: {
          tokenId: tId,
          owner,
          metadataURI: tokenURI,
          name: metadata?.name || null,
          description: metadata?.description || null,
          image: metadata?.image ? toPreviewSrc(metadata.image) : null,
          sport: metadata?.attributes?.find((a: any) => a.trait_type === "sport")?.value || null,
          rarity: metadata?.attributes?.find((a: any) => a.trait_type === "rarity")?.value || null,
          series: metadata?.attributes?.find((a: any) => a.trait_type === "series")?.value || null,
          edition: metadata?.attributes?.find((a: any) => a.trait_type === "edition")?.value || null,
        },
      });

      io.emit("CardMinted", card);
      console.log(`Card ${tId} synced from Pinata.`);
    } catch (e: any) {
      // P2002 = Prisma unique constraint violation. Not expected from your
      // contract logic (tokenId can't mint twice), but ethers WebSocket
      // providers can redeliver the same event on reconnect — this makes
      // that specific case a harmless no-op instead of an unhandled crash.
      if (e.code === "P2002") {
        console.warn(`Card ${tId} already exists — duplicate event delivery, skipping.`);
        return;
      }
      console.error("Error processing CardMinted:", e);
    }
  });


  // Transfer now only handles ownership changes AFTER mint — mint creation
  // is fully owned by the CardMinted handler above, avoiding two listeners
  // racing to create the same row.
  shadowCard.on("Transfer", async (from, to, tokenId, event) => {
    if (from === ethers.ZeroAddress) return; // mint — already handled by CardMinted

    const tId = Number(tokenId);
    await prisma.card.updateMany({
      where: { tokenId: tId },
      data: { owner: to },
    });
  });

  server.listen(3001, () => {
    console.log("Indexer WebSocket listening on port 3001");
  });
}

startIndexer().catch(console.error);
