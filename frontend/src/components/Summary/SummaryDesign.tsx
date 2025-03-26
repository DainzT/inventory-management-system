import { useMemo, useState } from "react";
import { YearSelector } from "./YearSelector";
import { MonthSelector } from "./MonthSelector";
import { InvoiceHeader } from "./InvoiceHeader";
import { InvoiceTable } from "./InvoiceTable";
import { InvoiceSummary } from "./InvoiceSummary";
import { Order } from "@/types";

interface SummaryDesignProps {
  orders: Order[];
}

const SummaryDesign = ({
  orders,
}: SummaryDesignProps) => {
  const printInvoice = () => {
    window.print();
  };

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
  console.log(getTotal())
  return (
    <>
      <main className="h-full flex flex-col">
        <article className="p-6 mx-auto bg-white rounded border border-stone-400 max-w-[920px] ">
          <div className="flex flex-col gap-6">
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
            <div>
              <InvoiceHeader
                selectedMonth={selectedMonth}
                selectedYear={selectedYear}
              />
              <InvoiceTable 
                orders={filteredOrders} 
              />
              <InvoiceSummary
                total={getTotal()}
              />
              <div className="flex justify-end mt-8">
                <button
                  className="px-6 py-3 text-base text-white bg-cyan-900 rounded cursor-pointer"
                  data-print-invoice="true"
                  aria-label="Print invoice"
                  onClick={printInvoice}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      printInvoice();
                    }
                  }}
                >
                  Print Invoice
                </button>
              </div>
            </div>
          </div>
        </article>
      </main>
      <div>
        <div
          dangerouslySetInnerHTML={{
            __html:
              "<link href=&quot;https://fonts.googleapis.com/css2?family=Inter&display=swap&quot; rel=&quot;stylesheet&quot;>",
          }}
        />
      </div>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @media print {
              button:not([data-print-invoice]),
              div[data-year-select],
              div[data-month-select] {
                display: none !important;
              }
              body {
                print-color-adjust: exact;
                -webkit-print-color-adjust: exact;
              }
              @page {
                margin: 0.5cm;
                size: auto;
              }
            }
          `,
        }}
      />
    </>
  );
}

export default SummaryDesign;
