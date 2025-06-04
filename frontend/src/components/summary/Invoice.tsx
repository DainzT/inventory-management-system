import { GroupedOrders, OrderItem } from "@/types";
import { SyntheticEvent, useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";
import { InvoiceHeader } from "@/components/Summary/InvoiceHeader";
import { InvoiceTable } from "@/components/Summary/InvoiceTable";
import { InvoiceSummary } from "@/components/Summary/InvoiceSummary";
import { DownloadButton } from "@/components/Summary/DownloadButton";
export interface InvoiceProps {
  orders: OrderItem[];
  selectedMonth: string;
  selectedYear: number;
  total: number;
  fleetName?: string;
}

export const Invoice = ({
  orders,
  selectedMonth,
  selectedYear,
  total,
  fleetName,
}: InvoiceProps) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const sortedOrders = [...orders].sort(
    (a, b) => new Date(a.outDate).getTime() - new Date(b.outDate).getTime()
  );
  const groupedByBoat = sortedOrders.reduce(
    (acc: Record<number, GroupedOrders>, order) => {
      if (!acc[order.boat.id]) {
        acc[order.boat.id] = {
          boatId: order.boat.id,
          boatName: order.boat.boat_name,
          orders: [],
        };
      }
      acc[order.boat.id].orders.push(order);
      return acc;
    },
    {}
  );

  const boatGroups = Object.values(groupedByBoat).sort((a, b) =>
    a.boatName.localeCompare(b.boatName)
  );

  const allOrders = boatGroups.flatMap((group) => group.orders);
  const getItemsPerPage = (orders: OrderItem[], pageIndex: number, totalPages: number) => {
    const isLastPage = pageIndex === totalPages - 1;

    const PAGE_HEIGHT = 1000;
    const HEADER_HEIGHT = 170;
    const FOOTER_HEIGHT = 200;
    const PAGE_NUMBER_HEIGHT = 50;
    const BOAT_HEADER_HEIGHT = 80;
    const ITEM_HEIGHTS = {
      SHORT: 70,
      MEDIUM: 100,
      LONG: 160,
      VERY_LONG: 200
    };

    const availableSpace = isLastPage
      ? PAGE_HEIGHT - HEADER_HEIGHT - FOOTER_HEIGHT - PAGE_NUMBER_HEIGHT
      : PAGE_HEIGHT - HEADER_HEIGHT - PAGE_NUMBER_HEIGHT;

    let currentHeight = 0;
    let itemsIncluded = 0;
    let lastBoatId: number | null = null;

    let startIndex = 0;
    for (let i = 0; i < pageIndex; i++) {
      startIndex += getItemsPerPage(orders.slice(startIndex), i, totalPages);
    }

    for (let i = startIndex; i < orders.length; i++) {
      const order = orders[i];

      if (order.boat.id !== lastBoatId) {
        if (currentHeight + BOAT_HEADER_HEIGHT > availableSpace) break;
        currentHeight += BOAT_HEADER_HEIGHT;
        lastBoatId = order.boat.id;
      }

      let itemHeight = ITEM_HEIGHTS.SHORT;
      if ((order.note?.length ?? 0) > 120) itemHeight = ITEM_HEIGHTS.VERY_LONG;
      else if ((order.note?.length ?? 0) > 90) itemHeight = ITEM_HEIGHTS.LONG;
      else if (order.name.length > 25 || (order.note?.length ?? 0) > 30) itemHeight = ITEM_HEIGHTS.MEDIUM;

      if (currentHeight + itemHeight > availableSpace) break;

      currentHeight += itemHeight;
      itemsIncluded++;
    }

    return Math.max(1, itemsIncluded);
  };

  const calculateTotalPages = (orders: OrderItem[]) => {
    if (orders.length === 0) return 1;
    let count = 0;
    let pages = 0;
    const estimatedTotalPages = Math.ceil(orders.length / 9);
    while (count < orders.length) {
      const itemsThisPage = getItemsPerPage(orders, pages, estimatedTotalPages);
      count += itemsThisPage;
      pages++;

      if (pages > 100) break;
    }

    return pages;
  };

  const totalPages = calculateTotalPages(allOrders);
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isManualScroll, setIsManualScroll] = useState(false);

  const getPageOrders = (pageIndex: number) => {
    let startIndex = 0;
    for (let i = 0; i < pageIndex; i++) {
      startIndex += getItemsPerPage(allOrders, i, totalPages);
    }

    const itemsPerPage = getItemsPerPage(allOrders, pageIndex, totalPages);
    const endIndex = startIndex + itemsPerPage;
    const pageOrders = allOrders.slice(startIndex, endIndex);
    const groups: GroupedOrders[] = [];
  let currentBoatId: number | null = null;

  for (const order of pageOrders) {
    if (order.boat.id !== currentBoatId) {
      groups.push({
        boatId: order.boat.id,
        boatName: order.boat.boat_name,
        orders: [],
      });
      currentBoatId = order.boat.id;
    }
    groups[groups.length - 1].orders.push(order);
  }

  return groups;
  };

  const handleScroll = (event: SyntheticEvent<HTMLDivElement>) => {
    if (isManualScroll) {
      return;
    }

    const container = event.currentTarget;
    const { scrollTop, scrollHeight, clientHeight } = container;

    const scrollPosition = scrollTop / (scrollHeight - clientHeight);

    const calculatedPage = Math.floor(scrollPosition * totalPages);

    const newPage = Math.max(0, Math.min(totalPages - 1, calculatedPage));

    if (newPage !== currentPage) {
      setCurrentPage(newPage);
    }
  };

  useEffect(() => {
    setCurrentPage(0);
  }, [boatGroups.length]);

  const handleDownloadPDF = async () => {
    const element = pageRefs.current;

    if (!element) return;

    setIsGeneratingPDF(true);
    try {
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: "a4",
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

        const data = canvas.toDataURL("image/png");
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = Math.min(pageWidth / imgWidth, pageHeight / imgHeight);
        const width = imgWidth * ratio;
        const height = imgHeight * ratio;

        pdf.addImage(data, "PNG", 0, 0, width, height);
      }

      pdf.save(`invoice_${selectedMonth}_${selectedYear}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const scrollToPage = (pageIndex: number) => {
    if (pageRefs.current[pageIndex] && containerRef.current) {
      setIsManualScroll(true);
      containerRef.current.scrollTo({
        top:
          pageRefs.current[pageIndex]?.offsetTop -
          containerRef.current.offsetTop,
        behavior: "smooth",
      });
      setIsManualScroll(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    const validatedPage = Math.max(0, Math.min(totalPages - 1, newPage));
    if (validatedPage !== currentPage) {
      scrollToPage(validatedPage);
    }
  };

  return (
    <div className="flex flex-col items-center p-10">
      <div className="flex items-center gap-4 mb-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 0}
          className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50 hover:bg-gray-300 transition-colors cursor-pointer"
        >
          Previous
        </button>

        <span className="text-sm font-medium">
          Page {currentPage + 1} of {totalPages}
        </span>

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages - 1}
          className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50 hover:bg-gray-300 transition-colors cursor-pointer"
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
        onScroll={handleScroll}
      >
        {allOrders.length > 0 ? (
          Array.from({ length: totalPages }).map((_, pageIndex) => {
            const pageGroups = Object.values(getPageOrders(pageIndex));
            return (
              <div
                key={pageIndex}
                ref={(el) => {
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
                    fleetName={String(fleetName)}
                    selectedMonth={selectedMonth}
                    selectedYear={selectedYear}
                  />
                  <div className="flex-grow">
                    <InvoiceTable
                      itemSummary={pageGroups}
                      totalPages={totalPages}
                    />
                  </div>
                  {pageIndex === totalPages - 1 && (
                    <div className="mt-auto">
                      <InvoiceSummary total={total} />
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
            ref={(el) => {
              if (el) {
                pageRefs.current[0] = el;
              }
            }}
          >
            <div className="flex-1 flex flex-col gap-6 ">
              <InvoiceHeader
                fleetName={String(fleetName)}
                selectedMonth={selectedMonth}
                selectedYear={selectedYear}
              />

              <div className="flex-grow">
                <InvoiceTable itemSummary={boatGroups} totalPages={totalPages} />
              </div>

              <div className="mt-auto">
                <InvoiceSummary total={total} />
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="mt-6">
        <DownloadButton
          onDownload={handleDownloadPDF}
          isLoading={isGeneratingPDF}
        />
      </div>
    </div>
  );
};
