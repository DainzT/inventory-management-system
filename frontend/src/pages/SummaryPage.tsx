import React, { useEffect, useState } from "react";
import SummaryDesign from "@/components/Summary/SummaryDesign";
import { PageTitle } from "@/components/PageTitle";
import { OrderItem } from "@/types";
import { useParams } from "react-router-dom";
import { fetchAssignedItems } from "@/api/orderAPI";

const Summary: React.FC = () => {
  const { fleetName } = useParams<{ fleetName: string }>();
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const modifiedName =
    fleetName === "f/b-dona-librada"
      ? fleetName.replace(/n/g, "ñ")?.replaceAll("-", " ").toUpperCase()
      : fleetName?.replaceAll("-", " ").toUpperCase();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        const fetchedOrders = await fetchAssignedItems();
        await new Promise((res) => setTimeout(res, 3000));
        setOrders(fetchedOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const filteredOrders =
    !fleetName || fleetName === "all-fleets"
      ? orders
      : orders.filter(
          (order) => order.fleet?.fleet_name.toUpperCase() === modifiedName
        );

  return (
    <div className="flex-1 p-0">
      <PageTitle title={String(modifiedName)} />
      <SummaryDesign
        fleetName={String(fleetName)}
        orders={filteredOrders}
        isLoading={isLoading}
      />
    </div>
  );
};

export default Summary;
