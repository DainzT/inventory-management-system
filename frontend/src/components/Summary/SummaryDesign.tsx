import { useMemo, useState } from "react";
import { YearSelector } from "./YearSelector";
import { MonthSelector } from "./MonthSelector";
import { Invoice } from "./Invoice";
import { OrderItem } from "@/types";
import ThreeDotsLoader from "./ThreeDotsLoader";
import { motion } from "framer-motion";

interface SummaryDesignProps {
  orders: OrderItem[];
  fleetName: string;
  isLoading: boolean;
}

const SummaryDesign = ({
  orders,
  fleetName,
  isLoading,
}: SummaryDesignProps) => {
  const availableYears = useMemo(() => {
    const years = new Set<number>();
    orders.forEach((order) => {
      try {
        const year = new Date(order.outDate).getFullYear();
        years.add(year);
      } catch {
        console.warn("Invalid date for order:", order.id);
      }
    });
    return Array.from(years).sort((a, b) => b - a);
  }, [orders]);

  const [selectedYear, setSelectedYear] = useState(
    availableYears[0] || new Date().getFullYear()
  );
  const [selectedMonth, setSelectedMonth] = useState("January");

  console.log("isLoading in SummaryDesign:", isLoading);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      try {
        const orderDate = new Date(order.outDate);
        return (
          orderDate.getFullYear() === selectedYear &&
          orderDate.toLocaleString("default", { month: "long" }) ===
            selectedMonth
        );
      } catch {
        console.warn("Invalid date for order:", order.id);
        return false;
      }
    });
  }, [orders, selectedYear, selectedMonth]);

  const getTotal = (): number => {
    return Number(
      filteredOrders
        .reduce((sum: number, order: OrderItem) => {
          const orderTotal = Number(order.total) || 0;

          const normalizedTotal = orderTotal;

          return sum + normalizedTotal;
        }, 0)
        .toFixed(2)
    );
  };

  const animationVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.main
      className="p-0 sm:p-7 h-full flex flex-col"
      initial="hidden"
      animate="visible"
      variants={animationVariants}
      transition={{ duration: 0.5 }}
    >
      <div className="p-7 flex-1 border-[1px] border-[#E5E7EB] bg-white shadow-[0px_4px_6px_0px_rgba(0,0,0,0.05)] rounded-[5px]">
        {isLoading ? (
          <div className="min-h-[200px] flex justify-center items-center">
            <ThreeDotsLoader className="w-8 h-8 text-gray-500" />
          </div>
        ) : (
          <>
            <motion.div
              data-year-select="true"
              initial="hidden"
              animate="visible"
              variants={animationVariants}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <YearSelector
                availableYears={availableYears}
                selectedYear={selectedYear}
                onYearSelect={setSelectedYear}
              />
            </motion.div>
            <motion.div
              data-month-select="true"
              initial="hidden"
              animate="visible"
              variants={animationVariants}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <MonthSelector
                selectedMonth={selectedMonth}
                onMonthSelect={setSelectedMonth}
              />
            </motion.div>
          </>
        )}
      </div>
      {!isLoading && (
        <motion.div
          className="mt-10 border-[1px] border-[#E5E7EB] bg-white shadow-[0px_4px_6px_0px_rgba(0,0,0,0.05)] rounded-[5px]"
          initial="hidden"
          animate="visible"
          variants={animationVariants}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Invoice
            orders={filteredOrders}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            total={getTotal()}
            fleetName={fleetName}
          />
        </motion.div>
      )}
    </motion.main>
  );
};

export default SummaryDesign;
