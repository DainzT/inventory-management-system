import { useEffect, useState, useCallback } from "react";
import SummaryDesign from "@/components/summary/SummaryDesign";
import { PageTitle } from "@/layout";
import { OrderItem } from "@/types";
import { useParams } from "react-router-dom";
import { fetchAssignedItems } from "@/api/orderAPI";
import { useToast } from "@/hooks/useToast";
import { toast } from "react-toastify";

const SummaryPage = () => {
  const { fleetName } = useParams<{ fleetName: string }>();
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { showLoadingToast, showSuccessToast, showErrorToast } = useToast();

  const memoizedShowLoadingToast = useCallback(showLoadingToast, []);
  const memoizedShowSuccessToast = useCallback(showSuccessToast, []);
  const memoizedShowErrorToast = useCallback(showErrorToast, []);

  let pageTitle = "ALL FLEETS";
  if (fleetName && fleetName !== "all-fleets") {
    pageTitle =
      fleetName === "f/b-dona-librada"
        ? fleetName.replace(/n/g, "ñ")?.replaceAll("-", " ").toUpperCase()
        : fleetName.replaceAll("-", " ").toUpperCase();
  }

  const filteredOrders =
    !fleetName || fleetName === "all-fleets"
      ? orders
      : orders.filter(
          (order) => order.fleet?.fleet_name.toUpperCase() === pageTitle
        );

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        const fetchedOrders = await fetchAssignedItems();
        setOrders(fetchedOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.error("Failed to fetch orders.");
      } finally {
        setIsLoading(false);
      }
    };

    const initializeFetch = () => {
      fetchOrders();
    };

    initializeFetch();
  }, [
    memoizedShowLoadingToast,
    memoizedShowSuccessToast,
    memoizedShowErrorToast,
  ]);

  return (
    <div className="flex-1 p-0">
      <PageTitle title={pageTitle} />
      <SummaryDesign
        fleetName={String(fleetName)}
        orders={filteredOrders}
        isLoading={isLoading}
      />
    </div>
  );
};

export default SummaryPage;
