"use client";
import { useState } from "react";
import { InvoiceItem } from "./types";
import { YearSelector } from "./YearSelector";
import { MonthSelector } from "./MonthSelector";
import { InvoiceHeader } from "./InvoiceHeader";
import { InvoiceTable } from "./InvoiceTable";
import { InvoiceSummary } from "./InvoiceSummary";

const SummaryDesign = () => {
  const [selectedYear, setSelectedYear] = useState(2025);
  const [selectedMonth, setSelectedMonth] = useState("January");
  const [items] = useState<InvoiceItem[]>([
    {
      id: 1,
      name: "Safety Rope",
      desc: "Premium Grade 24 inch",
      qty: 24,
      price: 89.99,
      boats: ["Boat 1", "Boat 2"],
    },
    {
      id: 2,
      name: "Life Jacket",
      desc: "Type III PFD Size XL",
      qty: 15,
      price: 129.99,
      boats: ["Boat 1", "Boat 3"],
    },
    {
      id: 3,
      name: "Navigation Light",
      desc: "LED 360° Waterproof",
      qty: 30,
      price: 89.99,
      boats: ["Boat 2"],
    },
  ]);

  const printInvoice = () => {
    window.print();
  };

  const getSubtotal = () => {
    return items
      .reduce((sum, item) => sum + item.qty * item.price, 0)
      .toFixed(2);
  };

  const getTax = () => {
    return (parseFloat(getSubtotal()) * 0.08).toFixed(2);
  };

  const getTotal = () => {
    return (parseFloat(getSubtotal()) + parseFloat(getTax())).toFixed(2);
  };

  return (
    <>
      <main className="p-6 w-screen bg-zinc-100 min-h-[screen]">
        <article className="p-6 mx-auto bg-white rounded border border-stone-400 max-w-[920px]">
          <div className="flex flex-col gap-6">
            <div data-year-select="true">
              <YearSelector
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
              <InvoiceTable items={items} />
              <InvoiceSummary
                subtotal={getSubtotal()}
                tax={getTax()}
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
