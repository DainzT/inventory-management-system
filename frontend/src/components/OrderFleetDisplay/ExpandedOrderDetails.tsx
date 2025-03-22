import React from "react";
import { OrderItemProps } from "@/types/FleetsOrder";

interface ExpandedOrderDetailsProps {
  order: OrderItemProps;
}

export const ExpandedOrderDetails: React.FC<ExpandedOrderDetailsProps> = ({
  order,
}) => {
  return (
    <div className="grid grid-cols-2 gap-6 px-15 py-4 bg-gray-50">
      <div>
        <div className="mb-1 text-sm text-gray-500">Total Price</div>
        <div className="text-base text-gray-800">
          <span>₱</span>
          <span>{Number(order.total).toFixed(2)}</span>
        </div>
      </div>
      <div>
        <div className="mb-1 text-sm text-gray-500">Fleet Assigned:</div>
        <div className="text-base text-gray-800">{order.fleet}</div>
      </div>
      <div>
        <div className="mb-1 text-sm text-gray-500">Selected Unit</div>
        <div className="text-base text-gray-800">{order.selectUnit}</div>
      </div>
      <div>
        <div className="mb-1 text-sm text-gray-500">Unit Size</div>
        <div className="text-base text-gray-800">{order.unitSize}</div>
      </div>
    </div>
  );
};
