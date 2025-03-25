interface YearSelectorProps {
    selectedYear: number;
    onYearSelect: (year: number) => void;
  }
  
  export const YearSelector = ({
    selectedYear,
    onYearSelect,
  }: YearSelectorProps) => {
    const years = [2025, 2026, 2027];
  
    return (
      <section className="flex flex-col gap-4">
        <h2 className="text-base font-semibold text-zinc-800">Select Year</h2>
        <div className="flex gap-2">
          {years.map((year) => (
            <button
              key={year}
              className="px-4 py-3 text-base rounded"
              onClick={() => onYearSelect(year)}
              style={{
                background: selectedYear === year ? "#295C65" : "#D1D0D0",
              }}
            >
              {year}
            </button>
          ))}
        </div>
      </section>
    );
  }
  