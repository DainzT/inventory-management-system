interface InvoiceHeaderProps {
    selectedMonth: string;
    selectedYear: number;
  }
  
  export const InvoiceHeader = ({
    selectedMonth,
    selectedYear,
  }: InvoiceHeaderProps) => {
    return (
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-cyan-900">INVOICE</h1>
        <time className="text-xl font-semibold">
          Invoice Date: {selectedMonth} 01, {selectedYear}
        </time>
      </header>
    );
  }
  