export type PinataUploadResult = {
  cid: string;
  ipfsUri: string;
  gatewayUrl: string;
};

export async function uploadFileToIPFS(
  file: File,
): Promise<PinataUploadResult> {
  try {
    if (!file) {
      throw new Error("No file provided");
    }

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/pinata/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.error || "Upload failed");
    }

    return {
      cid: data.cid,
      ipfsUri: `ipfs://${data.cid}`,
      gatewayUrl: `https://gateway.pinata.cloud/ipfs/${data.cid}`,
    };
  } catch (error) {
    console.log("error:", error);
    throw error;
  }
}

export async function unpinFromIPFS(cid: string): Promise<void> {
  try {
    const response = await fetch("/api/pinata/unpin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cid }),
    });
    if (!response.ok) {
      console.error("Failed to unpin", cid, await response.text());
    }
  } catch (e) {
    // Best-effort cleanup. A failed unpin shouldn't mask the original
    // mint error the user actually needs to see.
    console.error("Unpin request failed for", cid, e);
  }
}

export function extractCidFromUri(uri: string): string | null {
  return uri.startsWith("ipfs://") ? uri.replace("ipfs://", "") : null;
}
