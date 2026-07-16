// components/CardImageCropper.tsx
"use client";

import { CARD_ASPECT_RATIO, cropAndResizeImage, validateMinResolution } from "@/helpers/cropImage";
import { useCallback, useState } from "react";
import Cropper, { Area } from "react-easy-crop";
import { toast } from "sonner";

type Props = {
  file: File;
  onConfirm: (croppedFile: File) => void;
  onCancel: () => void;
};

export function CardImageCropper({ file, onConfirm, onCancel }: Props) {
  const [imageSrc] = useState(() => URL.createObjectURL(file));
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [processing, setProcessing] = useState(false);

  const onCropComplete = useCallback((_: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleConfirm = async () => {
    if (!croppedAreaPixels) return;
    setProcessing(true);
    try {
      await validateMinResolution(file);
      const result = await cropAndResizeImage(imageSrc, croppedAreaPixels);
      onConfirm(result);
    } catch (e: any) {
        console.log("error:",e)
      toast.error(e?.message || "Could not process image");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/90">
      <div className="relative flex-1">
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={CARD_ASPECT_RATIO} // 5:7 — hard-locked, not user-configurable
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropComplete}
          restrictPosition={true}
        />
      </div>

      <div className="flex items-center gap-4 p-4 bg-black">
        <input
          type="range"
          min={1}
          max={3}
          step={0.01}
          value={zoom}
          onChange={(e) => setZoom(Number(e.target.value))}
          className="flex-1"
        />
        <button onClick={onCancel} disabled={processing} className="px-4 py-2 text-sm text-white/70">
          Cancel
        </button>
        <button
          onClick={handleConfirm}
          disabled={processing || !croppedAreaPixels}
          className="px-4 py-2 text-sm font-medium bg-white text-black rounded-md disabled:opacity-50"
        >
          {processing ? "Processing…" : "Use this crop"}
        </button>
      </div>
    </div>
  );
}