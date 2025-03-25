interface InvoiceSummaryProps {
    subtotal: string;
    tax: string;
    total: string;
  }
  
export const InvoiceSummary = ({ 
    subtotal, 
    tax, 
    total 
}: InvoiceSummaryProps) => {
    return (
        <section className="flex flex-col gap-8">
        <div className="flex justify-end">
            <div className="p-4 bg-gray-50 rounded w-[230px]">
            <div className="flex justify-between mb-2">
                <span>Subtotal:</span>
                <span className="font-semibold">${subtotal}</span>
            </div>
            <div className="flex justify-between mb-2">
                <span>Tax (8%):</span>
                <span className="font-semibold">${tax}</span>
            </div>
            <div className="pt-4 mt-4 border border">
                <div className="flex justify-between">
                <span className="text-lg font-semibold">Total:</span>
                <span className="text-lg font-semibold text-cyan-900">
                    ${total}
                </span>
                </div>
            </div>
            </div>
        </div>
        <footer className="text-sm text-stone-500">
            <p>Payment Terms: Net 30</p>
            <p className="mt-2">
            Please make checks payable to: Marine Equipment & Supplies Co.
            </p>
        </footer>
        </section>
    );
}
  