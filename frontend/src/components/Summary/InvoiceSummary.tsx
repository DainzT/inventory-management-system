interface InvoiceSummaryProps {
    total: number;
  }
  
export const InvoiceSummary = ({ 
    total 
}: InvoiceSummaryProps) => {
    return (
        <section className="flex flex-col gap-8">
        <div className="flex justify-end">
            <div className="p-4 rounded w-[230px]">
            <div className="pt-4 mt-4  border">
                <div className="flex justify-between">
                <span className="text-lg font-semibold">Total:</span>
                <span className="text-lg font-semibold text-cyan-900">
                    ₱{total}
                </span>
                </div>
            </div>
            </div>
        </div>
        <footer className="text-sm text-stone-500">
            <p>This document serves as official record of fishing vessels expenses</p>
            <p className="mt-2">
                Vicmar Fishing Boat • BFAR Reg. No. 12345 • Contact: 0912-345-6789
            </p>
        </footer>
        </section>
    );
}
  