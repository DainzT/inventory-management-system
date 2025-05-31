import React from "react";
import { OrderItem } from "@/types/order-item"
import { fixEncoding } from "@/utils/Normalization";

interface ExpandedOrderDetailsProps {
  order: OrderItem;
}

export const ExpandedOrderDetails: React.FC<ExpandedOrderDetailsProps> = ({
  order,
}) => {
  return (
    <div className="grid grid-cols-2 gap-6 px-15 py-4 bg-gray-50 border-[1px] border-[#E5E7EB] 
            shadow-[0px_4px_6px_0px_rgba(0,0,0,0.05)]">
      <div>
        <div className="mb-1 text-sm text-gray-500">Total Price</div>
        <div className="text-base text-gray-800" data-testid="total-price">
          <span>₱</span>
          <span>{Number(order.total).toFixed(2)}</span>
        </div>
      </div>
      <div>
        <div className="mb-1 text-sm text-gray-500">Fleet Assigned:</div>
        <div className="text-base text-gray-800" data-testid="fleet-name">{fixEncoding(order.fleet.fleet_name)}</div>
      </div>
      <div>
        <div className="mb-1 text-sm text-gray-500">Last Updated</div>
        <div className="text-base text-gray-800" data-testid="last-updated">
          {order.lastUpdated ? (
            order.lastUpdated instanceof Date
              ? order.lastUpdated.toLocaleDateString('en-US', {
                  month: 'numeric',
                  day: 'numeric',
                  year: 'numeric'
                })
              : new Date(order.lastUpdated).toLocaleDateString('en-US', {
                  month: 'numeric',
                  day: 'numeric',
                  year: 'numeric'
                })
          ) : (
            'Not available'
          )}
        </div>
      </div>
    </div>
  );
};
