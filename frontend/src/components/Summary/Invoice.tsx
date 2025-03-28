import { InventoryItem, Order } from "@/types";
import { InvoiceHeader } from "./InvoiceHeader";
import { InvoiceTable } from "./InvoiceTable";
import { InvoiceSummary } from "./InvoiceSummary";
import { DownloadButton } from "./DownloadButton";
import { useEffect, useRef, useState } from "react";
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
        const [currentPage, setCurrentPage] = useState(0);
        const itemSummary = orders.reduce((acc, order) => {
            const itemId = order.item_id.id;
            
            if (!acc[itemId]) {
            acc[itemId] = {
                item: order.item_id,
                totalQuantity: order.quantity,
                totalPrice: order.total,
                orders: [order]
            };
            } else {
            acc[itemId].totalQuantity += order.quantity;
            acc[itemId].totalPrice += order.total;
            acc[itemId].orders.push(order);
            }
            return acc;
        }, {} as Record<number, {
            item: InventoryItem;
            totalQuantity: number;
            totalPrice: number;
            orders: Order[];
        }>);

    const ordersPerPage = 6;
    const allItems = Object.values(itemSummary);
    const totalPages = Math.ceil(Object.values(itemSummary).length / ordersPerPage);
    const pageRefs = useRef<(HTMLDivElement | null)[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleDownloadPDF = async () => {
        const element = pageRefs.current
        
        if (!element) return;
        
        const pdf = new jsPDF({
            orientation: "portrait",
            unit: "px",
            format: 'a4',
        });

        
        for (let pageNum = 0; pageNum < totalPages; pageNum++) {
            const pageElement = pageRefs.current[pageNum];
            if (!pageElement) continue;

            if (pageNum > 0) pdf.addPage();

            const canvas = await html2canvas(pageElement, {
                useCORS: true,
                scale: 2, 
                logging: true,
            });
        
            const data = canvas.toDataURL('image/png')
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            const imgWidth = canvas.width;
            const imgHeight = canvas.height;        
            const ratio = Math.min(pageWidth / imgWidth, pageHeight / imgHeight);
            const width = imgWidth * ratio;
            const height = imgHeight * ratio;

            pdf.addImage(data, "PNG", 0, 0, width, height);
        }
        
        pdf.save(`invoice_${selectedMonth}_${selectedYear}.pdf`)
    } 

    const scrollToPage = (pageIndex: number) => {
        if (pageRefs.current[pageIndex] && containerRef.current) {
            containerRef.current.scrollTo({
                top: pageRefs.current[pageIndex]?.offsetTop - containerRef.current.offsetTop,
                behavior: 'smooth'
            });
        }
    };

    const handlePageChange = (newPage: number) => {
        const validatedPage = Math.max(0, Math.min(totalPages - 1, newPage));
        setCurrentPage(validatedPage);
        scrollToPage(validatedPage);
    };

    useEffect(() => {
        scrollToPage(currentPage);
    }, [currentPage])

    return (
        <div className="flex flex-col items-center p-10">
                <div className="flex items-center gap-4 mb-4">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 0}
                        className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50 hover:bg-gray-300 transition-colors"
                    >
                        Previous
                    </button>
                    
                    <span className="text-sm font-medium">
                        Page {currentPage + 1} of {totalPages}
                    </span>
                    
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages - 1}
                        className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50 hover:bg-gray-300 transition-colors"
                    >
                        Next
                    </button>
                    
                    <div className="ml-4 flex items-center">
                        <span className="text-sm mr-2">Go to:</span>
                        <input
                            type="number"
                            min="1"
                            max={totalPages}
                            value={currentPage + 1}
                            onChange={(e) => handlePageChange(Number(e.target.value) - 1)}
                            className="w-16 px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
                <div 
                    className="w-[894px] h-[1160px] overflow-y-auto  p-4 rounded-lg border"  
                    ref={containerRef}
                >
                {allItems.length > 0 ? (
                    Array.from({ length: totalPages }).map((_, pageIndex) => {
                        const startIndex = pageIndex * ordersPerPage;
                        const endIndex = startIndex + ordersPerPage;
                        const pageItems = allItems.slice(startIndex, endIndex);
                        return (
                            <div    
                                key={pageIndex} 
                                ref={el => {
                                    if (el) {
                                        pageRefs.current[pageIndex] = el;
                                    }
                                }}
                                className="
                                    mt-3 flex flex-col p-6 mx-auto bg-[#fff] rounded border border-stone-400 w-[794px] h-[1123px] 
                                    margin-0  invoice-page"
                            >
                                <div className="flex-1 flex flex-col gap-6">
                                        <InvoiceHeader
                                        selectedMonth={selectedMonth}
                                        selectedYear={selectedYear}
                                        />
                                        <div className="flex-grow">
                                            <InvoiceTable itemSummary={pageItems} />
                                        </div>
                                    {pageIndex === totalPages - 1 && (
                                        <div className="mt-auto">
                                            <InvoiceSummary
                                                total={total}
                                            />
                                        </div>
                                    )}
                                </div>
                                <div className="text-sm text-gray-500 text-center mt-4">
                                    Page {pageIndex + 1} of {totalPages}
                                </div>
                            </div>
                            );
                        })
                    ) : (
                        <div 
                            className="
                                mt-3 flex flex-col p-6 mx-auto bg-[#fff] rounded border border-stone-400 w-[794px] h-[1123px] 
                                margin-0 invoice-page
                            "
                            ref={el => {
                                if (el) {
                                    pageRefs.current[0] = el;
                                }
                            }}
                        >
                            <div 
                                className="flex-1 flex flex-col gap-6 "
                            >
                                        <InvoiceHeader
                                            selectedMonth={selectedMonth}
                                            selectedYear={selectedYear}
                                        />

                                        <div className="flex-grow">
                                            <InvoiceTable itemSummary={allItems} />
                                        </div>
                                
                                        <div className="mt-auto">
                                            <InvoiceSummary
                                                total={total}
                                            />
                                        </div>
                            </div>
                        </div>
                    )}
                </div>
            <div className="mt-6">
                <DownloadButton onDownload={handleDownloadPDF}/>
            </div>
     </div>
    );
};