import React, { useEffect, useState } from "react";
import SummaryDesign from "@/components/Summary/SummaryDesign";
import { PageTitle } from "@/components/PageTitle";
import { OrderItem } from "@/types";
import { useParams } from "react-router-dom";
import { fetchAssignedItems } from "@/api/orderAPI";



const Summary: React.FC = () => {
  const { fleetName } = useParams<{ fleetName: string }>();
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const modifiedName =
    fleetName === "f/b-dona-librada"
      ? fleetName.replace(/n/g, "ñ")?.replaceAll("-", " ").toUpperCase()
      : fleetName?.replaceAll("-", " ").toUpperCase();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const fetchedOrders = await fetchAssignedItems();
        setOrders(fetchedOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
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
      <SummaryDesign fleetName={String(fleetName)} orders={filteredOrders} />
    </div>
  );
};

export default Summary;
