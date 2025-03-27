import { Order } from "@/types";
import { InvoiceHeader } from "./InvoiceHeader";
import { InvoiceTable } from "./InvoiceTable";
import { InvoiceSummary } from "./InvoiceSummary";
import { useRef } from "react";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";

interface InvoiceProps {
    orders: Order[];
    selectedMonth: string;
    selectedYear: number;
    total: number;
}

export const Invoice  = ({
   orders,
   selectedMonth,
   selectedYear, 
   total,
}: InvoiceProps) => {
    const printRef = useRef<HTMLDivElement>(null);

    const handleDownloadPDF = async () => {
        const element = printRef.current
        if (!element) {
            return;
        }
        
        const printButton = element.querySelector('[data-download-invoice]') as HTMLElement;
        
        if (printButton) printButton.style.display = 'none';
        
        const canvas = await html2canvas(element, {
            useCORS: true,
            scale: 2, 
        });
        
        const data = canvas.toDataURL('image/png')

        const pdf = new jsPDF({
            orientation: "portrait",
            unit: "px",
            format: 'a4'
          });

        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        const imgWidth = canvas.width;
        const imgHeight = canvas.height;        

        if (printButton) printButton.style.display = 'block';

        const ratio = Math.min(pageWidth / imgWidth, pageHeight / imgHeight);
        const width = imgWidth * ratio;
        const height = imgHeight * ratio;

        pdf.addImage(data, "PNG", 0, 0, width, height);
        pdf.save(`invoice_${selectedMonth}_${selectedYear}.pdf`)
        console.log(element)
    }

    return (
        <div className="flex flex-col items-center">
            <article 
                className="flex flex-col p-6 mx-auto bg-white rounded border border-stone-400 w-[794px] h-[1123px] margin-0 outline-1"
                ref= {printRef}
            >
                <div className="flex flex-col gap-6">
                        <InvoiceHeader
                        selectedMonth={selectedMonth}
                        selectedYear={selectedYear}
                        />
                        <InvoiceTable 
                        orders={orders} 
                        />
                </div>
                       <div className="mt-auto">
                        <InvoiceSummary
                            total={total}
                        />
                        </div>
                </article>  
                <div className="mt-6">
                    <button
                        className="
                            inline-flex font-medium items-center justify-center gap-2 px-4 py-3 text-base text-white
                            rounded-md cursor-pointer transition-colors duration-200 group
                            bg-green-500 hover:bg-green-600  
                        "
                        
                        data-print-invoice="true"
                        aria-label="Download invoice"
                        onClick={handleDownloadPDF}
                    >
                        Download Invoice
                        
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            width="20" 
                            height="20" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                            className="group-hover:translate-y-0.5 transition-transform duration-200"
                        >
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="7 10 12 15 17 10" />
                            <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                </button>  
            </div>
     </div>
    );
};