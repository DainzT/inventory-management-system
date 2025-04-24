export const TableHeader = () => {
  return (
    <div className="h-[60px] sm:h-[73px]
      w-[calc(100vw+170px)]  sm:w-full md:w-[calc(100vw)] lg:w-full
        bg-[#295C65] flex items-center flex-1 px-3 sm:px-0 md:px-6 lg:px-3 xl:px-5
        text-[12px] xs:text-xs sm:text-sm md:text-[13px] lg:text-[14px] xl:text-[16px] font-bold text-white
      ">
      <div className="min-w-[30px] xs:min-w-[40px] sm:min-w-[50px]  lg:min-w-[50px] xl:min-w-[60px]  text-left px-3 shrink-0">ID</div>

      <div className="min-w-[90px] xs:min-w-[80px] sm:min-w-[100px] md:min-w-[140px]  lg:min-w-[130px] xl:min-w-[160px] text-left px-3 truncate shrink-0 flex-1 ">
        Product Name
      </div>

      <div className="min-w-[90px] xs:min-w-[80px] sm:min-w-[100px] md:min-w-[130px] lg:min-w-[120px] xl:min-w-[150px] text-left px-3 truncate shrink-0 flex-1 ">
        Note
      </div>

      <div className="min-w-[80px] xs:min-w-[60px] sm:min-w-[80px] md:min-w-[100px] lg:min-w-[110px] xl:min-w-[120px] px-3 text-left shrink-0 flex-1">
        Quantity
      </div>

      <div className="min-w-[90px] xs:min-w-[80px] sm:min-w-[100px] md:min-w-[170px] lg:min-w-[120px] xl:min-w-[180px] px-3 text-left shrink-0 flex-1 ">
        Unit Price
      </div>

      <div className="min-w-[120px] sm:min-w-[120px] lg:min-w-[120px] xl:min-w-[160px] flex-1 text-center shrink-0 ">Actions</div>

      <div className="min-w-[20px] sm:min-w-[30px] md:min-w-[40px] shrink-0"></div>
    </div>
  );
}
