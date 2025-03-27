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
              className={`px-4 py-3 text-base rounded font-medium ${
                selectedYear === year 
                  ? 'bg-cyan-900 text-white' 
                  : 'outline-1 text-zinc-800'
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
  