import { InventoryItem } from "@/types";

interface ExpandedItemDetailsProps {
  item: InventoryItem;
  extraDetails?: {
    label: string;
    value: string | number | Date | null | undefined;
  }[];
}

export const ExpandedItemDetails: React.FC<ExpandedItemDetailsProps> = ({
  item,
  extraDetails,
}) => {
  return (
    <div className="grid grid-cols-2 gap-6 px-15 py-4 bg-gray-50">
      <div>
        <div className="mb-1 text-sm text-gray-500">Total Value</div>
        <div className="text-base text-gray-800">
          <span>₱</span>
          <span>{Number(item.total).toFixed(2)}</span>
        </div>
      </div>
      <div>
        <div className="mb-1 text-sm text-gray-500">Date Created</div>
        <div className="text-base text-gray-800">{item.dateCreated?.toLocaleDateString()}</div>
      </div>
      <div>
        <div className="mb-1 text-sm text-gray-500">Last Updated</div>
        <div className="text-base text-gray-800">{item.lastUpdated ? item.lastUpdated.toLocaleDateString() : "No date available"}</div>
      </div>
      {extraDetails?.map((detail, index) => (
        <div key={index}>
          <div className="mb-1 text-sm text-gray-500">{detail.label}</div>
          <div className="text-base text-gray-800">
            {detail.value?.toString() || "N/A"}
          </div>
        </div>
      ))}
    </div>
  );
};
