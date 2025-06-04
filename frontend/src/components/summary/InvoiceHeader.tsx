export interface InvoiceHeaderProps {
    selectedMonth: string;
    selectedYear: number;
    fleetName: string;
  }
  
  export const InvoiceHeader = ({
    selectedMonth,
    selectedYear,
    fleetName,
  }: InvoiceHeaderProps) => {
    return (
      <header className="flex justify-between items-center mb-8">
        <div className="flex flex-col">
        <span className="text-3xl font-bold text-cyan-800">
          {fleetName.replaceAll("-", " ").toUpperCase()}
        </span>
        <h1 className="text-2xl font-bold text-cyan-900">INVOICE</h1>
       
        </div>
        <div className="flex flex-col items-end  tracking-wide">
        <span className="text-3xl font-semibold text-cyan-800  tracking-wider">
          {selectedYear}
        </span>
        <span className="text-2xl font-semibold text-cyan-800 mt-1  tracking-[0.2rem]">
          {selectedMonth}
        </span>
      </div>
      </header>
    );
  }
  