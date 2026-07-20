import { toPreviewSrc } from "./preview";

export type CardMetadata = {
  name: string;
  description: string;
  image: string;
  attributes: { trait_type: string; value: string }[];
};

function getAttribute(
  metadata: CardMetadata,
  traitType: string,
): string | undefined {
  return metadata.attributes.find(
    (a) => a.trait_type.toLowerCase() === traitType.toLowerCase(),
  )?.value;
}

export const CardMetadataUtil = { getAttribute };

export async function fetchCardMetadata(
  tokenUri: string,
): Promise<CardMetadata> {
  const url = toPreviewSrc(tokenUri);
  if (!url) {
    throw new Error("URL not found!");
  }
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Metadata fetch failed (${res.status})`);
  }

  const data = await res.json();

  if (typeof data.name !== "string" || typeof data.image !== "string") {
    throw new Error("Metadata JSON is missing required fields (name/image)");
  }

  return {
    name: data.name,
    description: data.description ?? "",
    image: data.image,
    attributes: Array.isArray(data.attributes) ? data.attributes : [],
  };
}
