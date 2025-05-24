import { useMemo, useState } from "react";
import { YearSelector } from "./YearSelector";
import { MonthSelector } from "./MonthSelector";
import { Invoice } from "./Invoice";
import { OrderItem } from "@/types";
import SummaryDesignSkeleton from "./SummaryDesignSkeleton";

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
  const [selectedMonth, setSelectedMonth] = useState(new Date().toLocaleString("default", { month: "long" }));

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

  return (
    <main
      className="p-0 sm:p-7 h-full flex flex-col"
    >
      <div className="p-7 flex-1 border-[1px] border-[#E5E7EB] bg-white shadow-[0px_4px_6px_0px_rgba(0,0,0,0.05)] rounded-[5px]">
        {isLoading ? (
            <SummaryDesignSkeleton />
        ) : (
          <>
            <div
              data-year-select="true"
            >
              <YearSelector
                availableYears={availableYears}
                selectedYear={selectedYear}
                onYearSelect={setSelectedYear}
              />
            </div>
            <div
              data-month-select="true"
            >
              <MonthSelector
                selectedMonth={selectedMonth}
                onMonthSelect={setSelectedMonth}
              />
            </div>
          </>
        )}
      </div>
      {!isLoading && (
        <div
          className="mt-10 border-[1px] border-[#E5E7EB] bg-white shadow-[0px_4px_6px_0px_rgba(0,0,0,0.05)] rounded-[5px]"
        >
          <Invoice
            orders={filteredOrders}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            total={getTotal()}
            fleetName={fleetName}
          />
        </div>
      )}
    </main>
  );
};

export default SummaryDesign;
