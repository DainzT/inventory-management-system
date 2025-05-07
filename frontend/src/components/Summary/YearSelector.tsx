
interface YearSelectorProps {
    availableYears: number[];
    selectedYear: number;
    onYearSelect: (year: number) => void;
  }
  
  export const YearSelector = ({
    availableYears,
    selectedYear,
    onYearSelect,
  }: YearSelectorProps) => {
  
    return (
      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-semibold text-zinc-800 ">Select Year</h2>
        <div className="flex gap-2">
          {availableYears.map((year) => (
            <button
              key={year}
              className={`px-4 py-3 text-base rounded font-medium cursor-pointer
                transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)]
                border ${
                  selectedYear === year
                    ? 'bg-cyan-900 text-white border-cyan-900 hover:bg-cyan-800 hover:border-cyan-800'
                    : 'border-zinc-400 text-zinc-700 bg-[#fff] hover:bg-zinc-100 hover:border-zinc-600'
                }`}
              onClick={() => onYearSelect(year)}
            >
              {year}
            </button>
          ))}
        </div>
      </section>
    );
  }
  