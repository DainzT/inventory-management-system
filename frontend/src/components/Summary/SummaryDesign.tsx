import { useMemo, useState } from "react";
import { YearSelector } from "./YearSelector";
import { MonthSelector } from "./MonthSelector";
import { Invoice } from "./Invoice";
import { Order } from "@/types";

interface SummaryDesignProps {
  orders: Order[];
}

const SummaryDesign = ({
  orders,
}: SummaryDesignProps) => {
  const availableYears = useMemo(() => {
    const years = new Set<number>();
    orders.forEach(order => {
      try {
        const year = new Date(order.outDate).getFullYear();
        years.add(year);
      } catch {
        console.warn('Invalid date for order:', order.id);
      }
    });
    return Array.from(years).sort((a, b) => b - a); 
  }, [orders]);

  const [selectedYear, setSelectedYear] = useState(availableYears[0] || new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState("January");

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      try {
        const orderDate = new Date(order.outDate);
        return (
          orderDate.getFullYear() === selectedYear &&
          orderDate.toLocaleString('default', { month: 'long' }) === selectedMonth
        );
      } catch {
        console.warn('Invalid date for order:', order.id);
        return false;
      }
    });
  }, [orders, selectedYear, selectedMonth]);

  const getTotal = (): number => {
    return Number(
      filteredOrders
        .reduce((sum: number, order: Order) => {
          const unitSize = Number(order.item_id?.unitSize) || 1;
          
          const orderTotal = Number(order.total) || 0;
          
          const normalizedTotal = orderTotal / unitSize;
          
          return sum + normalizedTotal;
        }, 0)
        .toFixed(2) 
    );
  };


  return (
    <>
      <main className="h-full flex flex-col">
        <div className="p-7 flex-1 ">
          <div data-year-select="true">
              <YearSelector
                availableYears={availableYears}
                selectedYear={selectedYear}
                onYearSelect={setSelectedYear}
              />
          </div>
          <div data-month-select="true">
              <MonthSelector
                selectedMonth={selectedMonth}
                onMonthSelect={setSelectedMonth}
              />
          </div>
        </div>
        <Invoice 
          orders={filteredOrders}
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          total={getTotal()}
        />
      </main>
    </>
  );
}

export default SummaryDesign;
