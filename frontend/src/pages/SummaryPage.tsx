import React, { useEffect, useState, useCallback } from "react";
import SummaryDesign from "@/components/Summary/SummaryDesign";
import { PageTitle } from "@/components/PageTitle";
import { OrderItem } from "@/types";
import { useParams } from "react-router-dom";
import { fetchAssignedItems } from "@/api/orderAPI";
import { useToast } from "@/hooks/useToast";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Summary: React.FC = () => {
  const { fleetName } = useParams<{ fleetName: string }>();
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { showLoadingToast, showSuccessToast, showErrorToast } = useToast();

  // Memoize the toast functions to prevent unnecessary re-renders
  const memoizedShowLoadingToast = useCallback(showLoadingToast, []);
  const memoizedShowSuccessToast = useCallback(showSuccessToast, []);
  const memoizedShowErrorToast = useCallback(showErrorToast, []);

  const modifiedName =
    fleetName === "f/b-dona-librada"
      ? fleetName.replace(/n/g, "ñ")?.replaceAll("-", " ").toUpperCase()
      : fleetName?.replaceAll("-", " ").toUpperCase();

  useEffect(() => {
    const toastId = "fetch-orders-toast";

    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        const fetchedOrders = await fetchAssignedItems();
        await new Promise((res) => setTimeout(res, 3000));
        setOrders(fetchedOrders);
        memoizedShowSuccessToast(
          toastId,
          "All invoice items loaded successfully"
        );
      } catch (error) {
        console.error("Error fetching orders:", error);
        memoizedShowErrorToast(toastId, "Failed to fetch orders.");
      } finally {
        setIsLoading(false);
      }
    };

    const initializeFetch = () => {
      memoizedShowLoadingToast(toastId, "Fetching orders...");
      fetchOrders();
    };

    initializeFetch();
  }, [
    memoizedShowLoadingToast,
    memoizedShowSuccessToast,
    memoizedShowErrorToast,
  ]);

  const filteredOrders =
    !fleetName || fleetName === "all-fleets"
      ? orders
      : orders.filter(
          (order) => order.fleet?.fleet_name.toUpperCase() === modifiedName
        );

  return (
    <div className="flex-1 p-0">
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
      />
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
