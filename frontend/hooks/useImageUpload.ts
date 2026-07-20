import { toast } from "sonner";
import { uploadFileToIPFS } from "@/pinata/uploadToIpfs";
import { useMutation } from "@tanstack/react-query";

export function useImageUpload() {
  return useMutation({
    mutationKey: ["image"],
    mutationFn: async (file: File) => {
      const result = await uploadFileToIPFS(file);
      return result.ipfsUri;
    },
    onError: (e: any) => {
      toast.error(e?.message || "Image upload failed.");
    },
  });
}
