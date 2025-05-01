// src/hooks/useOrder.ts
import { useEffect, useState } from "react";
import { OrderItem } from "@/types/order-item";
import { fetchAssignedItems, updateArchivedStatus } from "@/api/orderAPI";
import { useToast } from "@/hooks/useToast";

const fleetBoats = {
  "F/B DONYA DONYA 2X": [
    "F/B Lady Rachelle",
    "F/B Mariella",
    "F/B My Shield",
    "F/B Abigail",
    "F/B DC-9",
  ],
  "F/B Doña Librada": [
    "F/B Adomar",
    "F/B Prince of Peace",
    "F/B Ruth Gaily",
    "F/V Vadeo Scout",
    "F/B Mariene",
  ],
};

export const useOrder = () => {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<OrderItem[]>([]);
  const [archivedOrders, setArchivedOrders] = useState<OrderItem[]>([]);
  const [activeFleet, setActiveFleet] = useState("All Fleets");
  const [selectedBoat, setSelectedBoat] = useState("All Boats");
  const [searchQuery, setSearchQuery] = useState("");

  const { showLoadingToast, showSuccessToast, showErrorToast } = useToast();

  const loadOrderItems = async () => {
    const toastId = "loadOrders";
    showLoadingToast(toastId, "Loading orders...");
    try {
      const response = await fetchAssignedItems();
      setOrders(response);
      setFilteredOrders(response);
      showSuccessToast(toastId, "Orders loaded successfully!");
    } catch (error) {
      console.error("Error fetching orders:", error);
      showErrorToast(toastId, "Failed to load orders.");
    }
  };

  useEffect(() => {
    loadOrderItems();
  }, []);

  useEffect(() => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const updatedArchivedOrders = orders.map((order) => {
      const orderDate = new Date(order.outDate);
      const isPastMonth =
        orderDate.getFullYear() < currentYear ||
        (orderDate.getFullYear() === currentYear &&
          orderDate.getMonth() < currentMonth);

      return {
        ...order,
        archived: isPastMonth,
      };
    });

    setArchivedOrders(updatedArchivedOrders);

    const updateArchiveInDB = async () => {
      try {
        await updateArchivedStatus(updatedArchivedOrders);
      } catch (error) {
        console.error(
          "Failed to update archived status in the database:",
          error
        );
      }
    };

    updateArchiveInDB();
  }, [orders]);

  useEffect(() => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const filtered = archivedOrders.filter((order) => {
      const orderDate = new Date(order.outDate);
      const isCurrentMonth =
        orderDate.getMonth() === currentMonth &&
        orderDate.getFullYear() === currentYear;

      const matchesSearch = [
        order.name.toLowerCase(),
        order.note.toLowerCase(),
        order.quantity.toString(),
        order.unitPrice.toString(),
        order.selectUnit.toLowerCase(),
        order.unitSize.toString(),
        order.total?.toString() || "",
        order.boat.boat_name.toLowerCase(),
        order.outDate.toString(),
      ].some((field) => field.includes(searchQuery.toLowerCase()));

      const matchesFleet =
        activeFleet === "All Fleets" ||
        fleetBoats[activeFleet as keyof typeof fleetBoats]?.includes(
          order.boat.boat_name
        ) ||
        order.boat.boat_name === activeFleet;

      const matchesBoat =
        selectedBoat === "All Boats" || order.boat.boat_name === selectedBoat;

      return isCurrentMonth && matchesSearch && matchesFleet && matchesBoat;
    });

    setFilteredOrders(filtered);
  }, [archivedOrders, searchQuery, activeFleet, selectedBoat]);


  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilter = (boat: string) => {
    setSelectedBoat(boat);
  };

  const handleFleetSelect = (fleet: string) => {
    setActiveFleet(fleet);
  };


  return {
    orders,
    filteredOrders,
    activeFleet,
    selectedBoat,
    searchQuery,
    setActiveFleet,
    handleSearch,
    handleFilter,
    handleFleetSelect,
    setFilteredOrders,
    setOrders,
  };
};
