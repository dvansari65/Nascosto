import { Button } from "@/components/button";
import { SimpleButton } from "../simple-button";

type ListCardPanelProps = {
  tokenId: string | null;
  onTokenIdChange: (value: string) => void;
  price: string;
  onPriceChange: (value: string) => void;
  isListing: boolean;
  listStatus: string;
  onList: () => void;
};

export function ListCardPanel({
  tokenId,
  onTokenIdChange,
  price,
  onPriceChange,
  isListing,
  listStatus,
  onList,
}: ListCardPanelProps) {

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-bold mb-4 font-display">List a Card</h2>
      <p className="text-neutral-600 mb-6">
        Enter your Token ID to list it. The smart contract will automatically encrypt your ask price using the eERC SDK.
      </p>
      <div className="flex flex-col gap-4">
        <div className="flex gap-4">
          <input
            type="number"
            placeholder="Token ID"
            className="flex-1 rounded-md border border-neutral-300 px-3 py-2"
            value={tokenId || ""}
            onChange={(e) => onTokenIdChange(e.target.value)}
          />
          <input
            type="number"
            placeholder="Asking Price (AVAX)"
            className="flex-1 rounded-md border border-neutral-300 px-3 py-2"
            value={price}
            onChange={(e) => onPriceChange(e.target.value)}
          />
        </div>
        <div className="w-full flex justify-center items-center  ">
          <SimpleButton onClick={onList} className="button-color-1 text-white  hover:cursor-pointer" disabled={isListing}>
            {isListing ? "Listing..." : "List Card"}
          </SimpleButton>
        </div>
      </div>
    </div>
  );
}