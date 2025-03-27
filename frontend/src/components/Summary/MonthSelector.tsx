interface MonthSelectorProps {
    selectedMonth: string;
    onMonthSelect: (month: string) => void;
  }
  
  export const MonthSelector = ({
    selectedMonth,
    onMonthSelect,
  }: MonthSelectorProps) => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
  
    return (
      <section className="flex flex-col gap-3 text-[0.9em] sm:text-[1em]">
        <h2 className="mt-4 text-2xl font-semibold text-zinc-800">Select Month</h2>
        <div className="grid grid-cols-4 gap-2 max-sm:grid-cols-2">
          {months.map((month) => (
            <button
              key={month}
              className={`py-4 text-base rounded font-medium ${
                selectedMonth === month 
                  ? 'bg-[#295C65] text-white' 
                  : 'outline-1 text-zinc-800'
              }`}
              onClick={() => onMonthSelect(month)}
            >
              {month}
            </button>
          ))}
        </div>
      </section>
    );
  }
  