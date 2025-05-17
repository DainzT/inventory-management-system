import { useEffect, useState } from "react";
import { OrderItem } from "@/types/order-item";
import { fetchAssignedItems, updateArchivedStatus } from "@/api/orderAPI";
import { toast } from "react-toastify";

const fleetBoats = {
  "F/B DONYA DONYA 2X": [
    "F/B DONYA DONYA 2x",
    "F/B Lady Rachelle",
    "F/B Mariella",
    "F/B My Shield",
    "F/B Abigail",
    "F/B DC-9",
  ],
  "F/B Doña Librada": [
    "F/B Doña Librada",
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
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadOrderItems = async () => {
      setIsLoading(true);
      try {
        const response = await fetchAssignedItems();
        if (response && Array.isArray(response)) {
          const unarchivedItems = response.filter(item => !item.archived);

          setOrders(unarchivedItems);
          setFilteredOrders(unarchivedItems);
        } else {
          console.error("Unexpected response format:", response);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.error("Failed to load orders", {
          isLoading: false,
          autoClose: 2000,
          hideProgressBar: false,
        });
      } finally {
        setIsLoading(false); // Ensure loading state is updated in both success and error cases
      }
    };

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

      const rowString = [
        order.name || "",
        order.note || "",
        order.quantity || "",
        typeof order.unitPrice === "number" ? order.unitPrice.toFixed(2) : order.unitPrice || "",
        order.selectUnit || "",
        order.unitSize || "",
        order.boat.boat_name || "",
        `${order.quantity || ""} ${order.selectUnit || ""}`,
        `${order.unitPrice || ""} ${order.selectUnit || ""}`,
        typeof order.unitPrice === "number"
          ? `${order.unitPrice.toFixed(2)} / ${order.unitSize || ""} ${order.selectUnit || ""}`
          : `${order.unitPrice || ""} / ${order.unitSize || ""} ${order.selectUnit || ""}`,
        new Date(order.outDate).toLocaleDateString() || ""
      ].join(" ").toLowerCase();


      console.log("Row String:", rowString);
      console.log("Search Query:", searchQuery.toLowerCase());

      const matchesSearch = searchQuery
        ? rowString.includes(searchQuery.toLowerCase())
        : true;

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
    isLoading,
  };
};
