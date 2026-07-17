import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import {
  ConfidentialSettlement,
  ShadowCardsMarketplace,
  MockERC721,
  MockEncryptedERC20
} from "../typechain-types";

describe("ShadowCardsMarketplace & ConfidentialSettlement", function () {
  let deployer: SignerWithAddress;
  let seller: SignerWithAddress;
  let buyer: SignerWithAddress;
  let nonOwner: SignerWithAddress;

  let settlement: ConfidentialSettlement;
  let marketplace: ShadowCardsMarketplace;
  let mockNFT: MockERC721;
  let mockEERC20: MockEncryptedERC20;

  const DUMMY_PRICE_HANDLE = ethers.encodeBytes32String("price_handle");
  const DUMMY_OFFER_HANDLE = ethers.encodeBytes32String("offer_handle");
  const DUMMY_PROOF = ethers.hexlify(ethers.randomBytes(64));
  let tokenId: number;

  beforeEach(async function () {
    [deployer, seller, buyer, nonOwner] = await ethers.getSigners();

    // Deploy Mocks
    const MockERC721Factory = await ethers.getContractFactory("MockERC721");
    mockNFT = (await MockERC721Factory.deploy()) as unknown as MockERC721;
    await mockNFT.waitForDeployment();

    const MockEncryptedERC20Factory = await ethers.getContractFactory("MockEncryptedERC20");
    mockEERC20 = (await MockEncryptedERC20Factory.deploy()) as unknown as MockEncryptedERC20;
    await mockEERC20.waitForDeployment();

    // Deploy Settlement
    const SettlementFactory = await ethers.getContractFactory("ConfidentialSettlement");
    settlement = (await SettlementFactory.deploy()) as unknown as ConfidentialSettlement;
    await settlement.waitForDeployment();

    // Deploy Marketplace
    const MarketplaceFactory = await ethers.getContractFactory("ShadowCardsMarketplace");
    marketplace = (await MarketplaceFactory.deploy(
      await settlement.getAddress(),
      await mockEERC20.getAddress()
    )) as unknown as ShadowCardsMarketplace;
    await marketplace.waitForDeployment();

    // Setup: link settlement to marketplace
    await settlement.connect(deployer).setMarketplace(await marketplace.getAddress());

    // Setup: Mint NFT to seller and approve Settlement contract
    const mintTx = await mockNFT.connect(seller).mint(seller.address);
    const receipt = await mintTx.wait();
    tokenId = Number(await mockNFT.currentTokenId());

    await mockNFT.connect(seller).approve(await settlement.getAddress(), tokenId);
  });

  describe("Deployment & Setup", function () {
    it("Should set the correct marketplace address in the settlement contract", async function () {
      expect(await settlement.marketplace()).to.equal(await marketplace.getAddress());
    });

    it("Should revert if setMarketplace is called twice", async function () {
      await expect(
        settlement.connect(deployer).setMarketplace(await marketplace.getAddress())
      ).to.be.revertedWithCustomError(settlement, "MarketplaceAlreadySet");
    });

    it("Should revert if setMarketplace is called by a non-owner", async function () {
      await expect(
        settlement.connect(nonOwner).setMarketplace(await marketplace.getAddress())
      ).to.be.revertedWithCustomError(settlement, "OwnableUnauthorizedAccount");
    });
  });

  describe("Listing Cards", function () {
    it("Should allow the owner to list a card and emit CardListed", async function () {
      await expect(
        marketplace.connect(seller).listCard(await mockNFT.getAddress(), tokenId, DUMMY_PRICE_HANDLE)
      )
        .to.emit(marketplace, "CardListed")
        .withArgs(await mockNFT.getAddress(), tokenId, seller.address, DUMMY_PRICE_HANDLE);

      const listing = await marketplace.listings(await mockNFT.getAddress(), tokenId);
      expect(listing.seller).to.equal(seller.address);
      expect(listing.status).to.equal(1n); // ListingStatus.Listed
      expect(listing.encryptedPriceHandle).to.equal(DUMMY_PRICE_HANDLE);
    });

    it("Should revert if a non-owner tries to list the card", async function () {
      await expect(
        marketplace.connect(nonOwner).listCard(await mockNFT.getAddress(), tokenId, DUMMY_PRICE_HANDLE)
      ).to.be.revertedWithCustomError(marketplace, "NotOwner");
    });
  });

  describe("Delisting Cards", function () {
    beforeEach(async function () {
      await marketplace.connect(seller).listCard(await mockNFT.getAddress(), tokenId, DUMMY_PRICE_HANDLE);
    });

    it("Should allow the seller to delist their card and emit CardDelisted", async function () {
      await expect(marketplace.connect(seller).delistCard(await mockNFT.getAddress(), tokenId))
        .to.emit(marketplace, "CardDelisted")
        .withArgs(await mockNFT.getAddress(), tokenId);

      const listing = await marketplace.listings(await mockNFT.getAddress(), tokenId);
      expect(listing.status).to.equal(4n); // ListingStatus.Delisted
    });

    it("Should revert if a non-seller tries to delist", async function () {
      await expect(
        marketplace.connect(nonOwner).delistCard(await mockNFT.getAddress(), tokenId)
      ).to.be.revertedWithCustomError(marketplace, "NotOwner");
    });
  });

  describe("Submitting Offers", function () {
    beforeEach(async function () {
      await marketplace.connect(seller).listCard(await mockNFT.getAddress(), tokenId, DUMMY_PRICE_HANDLE);
    });

    it("Should allow a buyer to submit an offer with an encrypted amount handle", async function () {
      await expect(
        marketplace.connect(buyer).submitOffer(await mockNFT.getAddress(), tokenId, DUMMY_OFFER_HANDLE)
      )
        .to.emit(marketplace, "OfferSubmitted")
        .withArgs(await mockNFT.getAddress(), tokenId, buyer.address, DUMMY_OFFER_HANDLE);

      const offer = await marketplace.offers(await mockNFT.getAddress(), tokenId, buyer.address);
      expect(offer.buyer).to.equal(buyer.address);
      expect(offer.encryptedAmountHandle).to.equal(DUMMY_OFFER_HANDLE);
      expect(offer.withdrawn).to.be.false;
    });

    it("Should revert if the card is not listed", async function () {
      // Delist the card first
      await marketplace.connect(seller).delistCard(await mockNFT.getAddress(), tokenId);

      await expect(
        marketplace.connect(buyer).submitOffer(await mockNFT.getAddress(), tokenId, DUMMY_OFFER_HANDLE)
      ).to.be.revertedWithCustomError(marketplace, "InvalidListing");
    });
  });

  describe("Accepting Offers & Settlement", function () {
    beforeEach(async function () {
      await marketplace.connect(seller).listCard(await mockNFT.getAddress(), tokenId, DUMMY_PRICE_HANDLE);
      await marketplace.connect(buyer).submitOffer(await mockNFT.getAddress(), tokenId, DUMMY_OFFER_HANDLE);
    });

    it("Should successfully accept an offer, transfer the NFT, and emit OfferAccepted and TradeSettled", async function () {
      // Listen for TradeSettled from the Settlement contract, and OfferAccepted from the Marketplace contract
      await expect(
        marketplace.connect(seller).acceptOffer(await mockNFT.getAddress(), tokenId, buyer.address, DUMMY_PROOF)
      )
        .to.emit(marketplace, "OfferAccepted")
        .withArgs(await mockNFT.getAddress(), tokenId, buyer.address)
        .and.to.emit(settlement, "TradeSettled")
        .withArgs(await mockNFT.getAddress(), tokenId, buyer.address, seller.address);

      // Verify the NFT was actually transferred
      expect(await mockNFT.ownerOf(tokenId)).to.equal(buyer.address);

      // Verify listing status is now Sold
      const listing = await marketplace.listings(await mockNFT.getAddress(), tokenId);
      expect(listing.status).to.equal(3n); // ListingStatus.Sold
    });

    it("Should revert if a non-seller tries to accept the offer", async function () {
      await expect(
        marketplace.connect(nonOwner).acceptOffer(await mockNFT.getAddress(), tokenId, buyer.address, DUMMY_PROOF)
      ).to.be.revertedWithCustomError(marketplace, "NotOwner");
    });

    it("Should revert if the offer does not exist", async function () {
      await expect(
        marketplace.connect(seller).acceptOffer(await mockNFT.getAddress(), tokenId, nonOwner.address, DUMMY_PROOF)
      ).to.be.revertedWithCustomError(marketplace, "OfferDoesNotExist");
    });

    it("Should revert if the confidential payment fails in the eERC token", async function () {
      // Configure mock to fail
      await mockEERC20.setShouldFail(true);

      // We expect the custom error from the settlement contract.
      // Since `acceptOffer` calls `executeSettlement` which throws `ConfidentialPaymentFailed()`,
      // we check for that error propagating up.
      await expect(
        marketplace.connect(seller).acceptOffer(await mockNFT.getAddress(), tokenId, buyer.address, DUMMY_PROOF)
      ).to.be.revertedWithCustomError(settlement, "ConfidentialPaymentFailed");
    });
  });
});
