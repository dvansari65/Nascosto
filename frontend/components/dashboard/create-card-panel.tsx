import { useRef, useState } from "react";
import { Button } from "@/components/button";
import { toPreviewSrc } from "@/helpers/preview";
import {
    CardForm,
    SPORTS,
    RARITIES,
} from "@/types/card";
import { CardImageCropper } from "../card-image-cropper";
import { SimpleButton } from "../simple-button";

type CreateCardPanelProps = {
    cardForm: CardForm;
    onFieldChange: <K extends keyof CardForm>(
        field: K,
        value: CardForm[K]
    ) => void;
    onImageSelect: (file?: File) => void;
    isUploadingImage: boolean;
    isMinting: boolean;
    onMint: () => void;
};

export function CreateCardPanel({
    cardForm,
    onFieldChange,
    onImageSelect,
    isUploadingImage,
    isMinting,
    onMint,
}: CreateCardPanelProps) {
    const [pendingFile, setPendingFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleRawFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) setPendingFile(file); // opens cropper — nothing uploaded yet
        e.target.value = ""; // allow re-selecting the same file after cancel
    };

    const handleCropConfirm = (croppedFile: File) => {
        setPendingFile(null);
        onImageSelect(croppedFile); // parent's existing upload flow runs on the cropped file
    };

    const handleCropCancel = () => {
        setPendingFile(null);
    };

    return (
        <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 font-display text-2xl font-bold">
                Create Trading Card
            </h2>

            <p className="mb-6 text-neutral-600">
                Add the card details and upload its artwork before minting.
            </p>

            <div className="grid gap-4">
                {/* Title */}
                <div className="grid gap-1">
                    <label className="text-sm font-medium text-neutral-700">
                        Card Title
                    </label>
                    <input
                        type="text"
                        required
                        placeholder="Cristiano Ronaldo"
                        className="rounded-md border border-neutral-300 px-3 py-2 outline-none transition focus:border-neutral-500"
                        value={cardForm.title}
                        onChange={(e) =>
                            onFieldChange("title", e.target.value)
                        }
                    />
                </div>

                {/* Description */}
                <div className="grid gap-1">
                    <label className="text-sm font-medium text-neutral-700">
                        Description
                    </label>
                    <textarea
                        rows={4}
                        required
                        placeholder="A legendary football icon..."
                        className="resize-none rounded-md border border-neutral-300 px-3 py-2 outline-none transition focus:border-neutral-500"
                        value={cardForm.description}
                        onChange={(e) =>
                            onFieldChange("description", e.target.value)
                        }
                    />
                </div>

                {/* Image Upload */}
                <div className="grid gap-1">
                    <label className="text-sm font-medium text-neutral-700">
                        Card Artwork
                    </label>

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/png,image/jpeg,image/webp,image/gif"
                        className="rounded-md border border-neutral-300 px-3 py-2"
                        disabled={isUploadingImage || isMinting}
                        onChange={handleRawFileSelect}
                    />
                    <p className="text-xs text-neutral-400">
                        You&apos;ll be able to crop it to the 5:7 card ratio next.
                    </p>
                </div>

                {isUploadingImage && (
                    <p className="text-xs font-mono text-neutral-500">
                        Uploading image...
                    </p>
                )}

                {cardForm.imageUri && (
                    <>
                        <p className="break-all text-xs font-mono text-neutral-500">
                            Image: {cardForm.imageUri}
                        </p>

                        <div className="aspect-[5/7] w-40 overflow-hidden rounded-lg border border-neutral-200 bg-neutral-50">
                            <img
                                src={toPreviewSrc(cardForm.imageUri)}
                                alt="Trading card preview"
                                className="h-full w-full object-cover"
                            />
                        </div>
                    </>
                )}

                {/* Metadata */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {/* Sport */}
                    <div className="grid gap-1">
                        <label className="text-sm font-medium text-neutral-700">
                            Sport
                        </label>

                        <select
                            required
                            className="rounded-md border border-neutral-300 bg-white px-3 py-2 outline-none transition focus:border-neutral-500"
                            value={cardForm.sport}
                            onChange={(e) =>
                                onFieldChange("sport", e.target.value as CardForm["sport"])
                            }
                        >
                            <option value="" disabled>
                                Select a sport
                            </option>

                            {SPORTS.map((sport) => (
                                <option key={sport} value={sport}>
                                    {sport}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Rarity */}
                    <div className="grid gap-1">
                        <label className="text-sm font-medium text-neutral-700">
                            Rarity
                        </label>

                        <select
                            required
                            className="rounded-md border border-neutral-300 bg-white px-3 py-2 outline-none transition focus:border-neutral-500"
                            value={cardForm.rarity}
                            onChange={(e) =>
                                onFieldChange("rarity", e.target.value as CardForm["rarity"])
                            }
                        >
                            <option value="" disabled>
                                Select rarity
                            </option>

                            {RARITIES.map((rarity) => (
                                <option key={rarity} value={rarity}>
                                    {rarity}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Series */}
                    <div className="grid gap-1">
                        <label className="text-sm font-medium text-neutral-700">
                            Series
                        </label>

                        <input
                            type="text"
                            placeholder="GOAT Collection"
                            className="rounded-md border border-neutral-300 px-3 py-2 outline-none transition focus:border-neutral-500"
                            value={cardForm.series}
                            onChange={(e) =>
                                onFieldChange("series", e.target.value)
                            }
                        />
                    </div>

                    {/* Edition */}
                    <div className="grid gap-1">
                        <label className="text-sm font-medium text-neutral-700">
                            Edition
                        </label>

                        <input
                            type="text"
                            placeholder="World Cup 2026"
                            className="rounded-md border border-neutral-300 px-3 py-2 outline-none transition focus:border-neutral-500"
                            value={cardForm.edition}
                            onChange={(e) =>
                                onFieldChange("edition", e.target.value)
                            }
                        />
                    </div>

                    {/* Total Copies */}
                    <div className="grid gap-1 sm:col-span-2">
                        <label className="text-sm font-medium text-neutral-700">
                            Total Copies
                        </label>

                        <input
                            type="number"
                            min={1}
                            step={1}
                            placeholder="100"
                            className="rounded-md border border-neutral-300 px-3 py-2 outline-none transition focus:border-neutral-500"
                            value={cardForm.totalCopies}
                            onChange={(e) =>
                                onFieldChange(
                                    "totalCopies",
                                    Number(e.target.value)
                                )
                            }
                        />
                    </div>
                </div>

                <div className="mt-2 flex justify-center">
                    <SimpleButton
                        className="px-20 text-xl button-color-1 text-white "
                        disabled={isUploadingImage || isMinting}
                        onClick={onMint}
                    >
                        {isMinting ? "Minting..." : "Create Card"}
                    </SimpleButton>
                </div>
            </div>

            {pendingFile && (
                <CardImageCropper
                    file={pendingFile}
                    onCancel={handleCropCancel}
                    onConfirm={handleCropConfirm}
                />
            )}
        </div>
    );
}