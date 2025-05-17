import { motion } from "framer-motion";
import ReactPaginate from "react-paginate";

const shimmerVariants = {
    initial: { backgroundPosition: "-200% 0" },
    animate: {
        backgroundPosition: "200% 0",
        transition: {
            repeat: Infinity,
            repeatType: "reverse" as const,
            duration: 1.5,
            ease: "linear",
        },
    },
};

const InventoryManagementTableSkeleton = () => {
    return (
        <motion.main
            initial="hidden"
            animate="visible"
            className="p-[30px] max-sm:p-0 max-lg:p-[15px] h-[calc(100vh-120px)]"
        >
            <motion.section
                initial="hidden"
                animate="visible"
                className="bg-white rounded-[10px] w-[calc(100vw+170px)] sm:w-full md:w-[calc(100vw)] lg:w-full"
            >
                <motion.div
                    initial="hidden"
                    animate="visible"
                    className="bg-[#fff] pt-1 z-10 sticky top-0 ml-[0.3px]"
                >
                    <motion.div
                        className="bg-white border-[1px] border-[#E5E7EB] shadow-[0px_4px_6px_0px_rgba(0,0,0,0.05)]
              rounded-tr-[10px] rounded-tl-[10px] 
              w-[calc(100vw+170px)] sm:w-full md:w-[calc(100vw)] lg:w-full
              p-2 sm:p-[15px] flex items-center gap-[100.6px]"
                    >
                        <motion.div
                            variants={shimmerVariants}
                            initial="initial"
                            animate="animate"
                            className="flex-[0.91] h-[50px] rounded-[12px] border-[2px] border-[#E5E7EB] bg-[#F8FAFA] px-[14px] overflow-hidden relative"
                            style={{
                                background:
                                    "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
                                backgroundSize: "200% 100%",
                            }}
                        />
                        <motion.div
                            variants={shimmerVariants}
                            initial="initial"
                            animate="animate"
                            className="flex items-center gap-[10px] h-[51px] px-[12px] scale-90 rounded-[12px] bg-[#295C65] overflow-hidden relative"
                            style={{
                                background:
                                    "linear-gradient(90deg, #3d6571 25%, #275050 50%, #3d6571 75%)",
                                backgroundSize: "200% 100%",
                            }}
                        >
                            <div className="h-5 w-5 bg-white rounded-full opacity-70" />
                            <div className="h-5 w-15 bg-white rounded opacity-70" />
                        </motion.div>
                    </motion.div>
                    <motion.div
                        variants={shimmerVariants}
                            initial="initial"
                            animate="animate"
                        style={{
                            background:
                                "linear-gradient(90deg, #3d6571 25%, #275050 50%, #3d6571 75%)",
                            backgroundSize: "200% 100%",
                        }}
                        className="grid px-5 py-6 w-full text-[16px] font-bold text-white bg-[#295C65]  grid-cols-[minmax(30px,0.5fr)_minmax(90px,1.6fr)_minmax(90px,1.5fr)_minmax(80px,1fr)_minmax(90px,1.8fr)_minmax(120px,1.6fr)_40px]">
                        {["Date Out", "Product Name", "Note", "Quantity", "Unit Price", "Boat"].map((_, index) => (
                            <motion.div
                                key={index}
                                
                                className="h-6 bg-[#295c6500] rounded mx-2 opacity-70 overflow-hidden"
                            />
                        ))}
                    </motion.div>
                </motion.div>
                <div className="flex-1 min-h-0 orders-table-content">
                    {[...Array(6)].map((_, rowIndex) => (
                        <div
                            key={rowIndex}
                            className="flex-1 px-5 grid items-center py-[24.5px] grid-cols-[minmax(30px,0.5fr)_minmax(90px,1.6fr)_minmax(90px,1.5fr)_minmax(80px,1fr)_minmax(90px,1.8fr)_minmax(120px,1.6fr)_40px]
                                border-b border-[#E5E7EB] bg-white"
                        >
                            {[...Array(7)].map((_, cellIndex) => (
                                <motion.div
                                    key={cellIndex}
                                    variants={shimmerVariants}
                                    initial="initial"
                                    animate="animate"
                                    className="h-4 bg-gray-200 rounded mx-2 overflow-hidden"
                                    style={{
                                        background: "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
                                        backgroundSize: "200% 100%",
                                    }}
                                />
                            ))}
                        </div>
                    ))}
                </div>
                <motion.div
                    className="sticky bottom-0 bg-[#fff] pb-4 w-full ml-[0.3px]"
                    variants={shimmerVariants}
                    initial="initial"
                    animate="animate"
                    style={{
                        background:
                            "linear-gradient(90deg, #fff 100%, #fff 100%, #fff 100%)",
                        backgroundSize: "200% 100%",
                    }}
                >
                    <div
                        className="p-4 px-6 border-t border-[1px] border-[#E5E7EB] shadow-[0px_4px_6px_0px_rgba(0,0,0,0.05)] bg-gray-50 text-sm text-gray-500 rounded-br-[10px] rounded-bl-[10px] w-[calc(100vw+180px)] sm:w-full md:w-[calc(100vw)] lg:w-full flex justify-between items-center"
                    >
                        <motion.div
                            className="h-5 w-40 rounded bg-gray-300"
                        />
                        <ReactPaginate
                            previousLabel={"Previous"}
                            nextLabel={"Next"}
                            breakLabel={"..."}
                            pageCount={20}
                            marginPagesDisplayed={2}
                            pageRangeDisplayed={5}
                            onPageChange={() => { }}
                            containerClassName={"flex items-center gap-1 select-none"}
                            pageClassName={
                                "relative px-3 py-3 border border-gray-400 rounded text-sm hover:bg-[#295C65]/10 hover:border-[#295C65]/30 transition-colors duration-200"
                            }
                            pageLinkClassName={
                                "absolute inset-0 w-full h-full flex items-center justify-center text-gray-700 hover:text-[#295C65] select-none"
                            }
                            activeClassName={"bg-[#295C65] border-[#295C65] text-white font-bold"}
                            activeLinkClassName={"text-white select-none"}
                            previousClassName={
                                "font-medium relative py-3 px-8 flex items-center justify-center px-3 border border-gray-400 rounded text-sm cursor-not-allowed opacity-50"
                            }
                            previousLinkClassName={"absolute inset-0 w-full h-full flex items-center justify-center focus:outline-none"}
                            nextClassName={
                                "font-medium relative py-3 px-6 flex items-center justify-center px-3 border border-gray-400 rounded text-sm cursor-not-allowed opacity-50"
                            }
                            nextLinkClassName={"absolute inset-0 w-full h-full flex items-center justify-center focus:outline-none"}
                            disabledClassName={"opacity-50 cursor-not-allowed select-none"}
                            disabledLinkClassName={"hover:bg-transparent hover:text-gray-700 select-none"}
                            breakClassName={"px-2 text-gray-500 select-none"}
                            forcePage={0}
                        />
                    </div>
                </motion.div>
            </motion.section>
        </motion.main>
    );
};

export default InventoryManagementTableSkeleton;
