export interface MonthSelectorProps {
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
            className={`py-4 text-base rounded font-medium cursor-pointer ${selectedMonth === month
                ? 'bg-cyan-900 text-white border-cyan-900 hover:bg-cyan-800 hover:border-cyan-800'
                : ' outline-1 border-zinc-600 text-zinc-700 bg-[#fff] hover:bg-zinc-100 hover:border-zinc-600'
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
