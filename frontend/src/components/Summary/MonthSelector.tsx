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
      <section className="flex flex-col gap-4">
        <h2 className="text-base font-semibold text-zinc-800">Select Month</h2>
        <div className="grid grid-cols-4 gap-2 max-sm:grid-cols-2">
          {months.map((month) => (
            <button
              key={month}
              className="px-4 py-2 text-sm rounded"
              onClick={() => onMonthSelect(month)}
              style={{
                background: selectedMonth === month ? "#295C65" : "#D1D0D0",
              }}
            >
              {month}
            </button>
          ))}
        </div>
      </section>
    );
  }
  