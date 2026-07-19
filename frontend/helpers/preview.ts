type ImageOpts = { width?: number; height?: number; fit?: "cover" | "contain" | "scaleDown" };

export function toPreviewSrc(uri: string, opts?: ImageOpts) {
  const gateway = process.env.NEXT_PUBLIC_PINATA_GATEWAY;
  let base: string;
  if(!uri){
    return
  }
  if (uri.startsWith("ipfs://")) {
    const cid = uri.replace("ipfs://", "");
    base = gateway ? `https://${gateway}/ipfs/${cid}` : `https://ipfs.io/ipfs/${cid}`;
  } else if (uri.startsWith("ar://")) {
    return `https://arweave.net/${uri.replace("ar://", "")}`; // no optimization on Arweave
  } else {
    base = uri;
  }

  // Pinata image optimization only works through your Pinata gateway
  if (!gateway || !opts) return base;

  const params = new URLSearchParams();
  if (opts.width) params.set("img-width", String(opts.width));
  if (opts.height) params.set("img-height", String(opts.height));
  if (opts.fit) params.set("img-fit", opts.fit === "scaleDown" ? "scale-down" : opts.fit);
  params.set("img-format", "webp");

  return `${base}?${params.toString()}`;
}