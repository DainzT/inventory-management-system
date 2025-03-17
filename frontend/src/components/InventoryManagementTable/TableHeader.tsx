export const TableHeader = () => {
    return (
      <div className="w-full h-[73px] bg-[#295C65] flex items-center px-[21px] text-[16px] font-bold text-white">
        <div className="w-[60px]">ID</div>
        <div className="w-[192px]">Product Name</div>
        <div className="w-[286px]">Note</div>
        <div className="w-[130px]">Quantity</div>
        <div className="w-[162px]">Unit Price</div>
        <div className="flex-1 text-center">Actions</div>
      </div>
    );
}
  