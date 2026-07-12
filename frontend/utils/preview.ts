export function toPreviewSrc(uri: string) {
    if (uri.startsWith("ipfs://")) {
      return `https://ipfs.io/ipfs/${uri.replace("ipfs://", "")}`;
    }
    if (uri.startsWith("ar://")) {
      return `https://arweave.net/${uri.replace("ar://", "")}`;
    }
    return uri;
  }