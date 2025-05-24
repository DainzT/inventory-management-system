import { motion } from "framer-motion";

const OrdersManagementTableSkeleton = () => {

    const shimmerVariants = {
        initial: { backgroundPosition: "-200% 0" },
        animate: {
            backgroundPosition: "200% 0",
            transition: {
                repeat: Infinity,
                repeatType: "reverse" as const,
                duration: 2.5,
                ease: "linear",
            },
        },
    };

    return (
        <>
            <div className="p-[30px]">
                <section className="flex-1 bg-[#fff] rounded-xl flex flex-col">
                    <div className="stick sticky top-0 z-10">
                        <div className="flex bg-white border-[1px] border-[#E5E7EB] 
            shadow-[0px_4px_6px_0px_rgba(0,0,0,0.05)] rounded-tr-[10px] rounded-tl-[10px]
            p-2 sm:p-[15px] items-center gap-20">
                            <motion.div
                                variants={shimmerVariants}
                                initial="initial"
                                animate="animate"
                                className="flex-[0.92] h-[50px] rounded-[12px] border-[2px] border-[#E5E7EB] bg-[#F8FAFA] px-[14px] overflow-hidden"
                                style={{
                                    background: "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
                                    backgroundSize: "200% 100%",
                                }}
                            />
                            <motion.div
                                variants={shimmerVariants}
                                initial="initial"
                                animate="animate"
                                className="relative ml-3 -mr-15 w-60 h-[50px] rounded-[12px] border-[2px] border-[#E5E7EB] bg-[#F8FAFA] overflow-hidden"
                                style={{
                                    background: "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
                                    backgroundSize: "200% 100%",
                                }}
                            />
                        </div>
                        <motion.div
                            variants={shimmerVariants}
                            initial="initial"
                            animate="animate"
                            style={{
                                background:
                                    "linear-gradient(90deg, #3d6571 25%, #275050 50%, #3d6571 75%)",
                                backgroundSize: "200% 100%",
                            }}
                            className="grid px-5 py-6 w-full text-[16px] font-bold text-white bg-[#295C65] grid-cols-[minmax(120px,0.8fr)_minmax(150px,1.3fr)_minmax(200px,1.45fr)_minmax(100px,1fr)_minmax(100px,1fr)_minmax(100px,1fr)_120px_40px]">
                            {["Date Out", "Product Name", "Note", "Quantity", "Unit Price", "Boat", "Actions"].map((_, index) => (
                                <motion.div
                                    key={index}
                                    className="h-6 bg-[#295c6500] rounded mx-2 opacity-70 overflow-hidden"
                                />
                            ))}
                        </motion.div>
                    </div>
                    <div className="flex-1 min-h-0 orders-table-content">
                        {[...Array(10)].map((_, rowIndex) => (
                            <div
                                key={rowIndex}
                                className="flex-1 px-5 grid items-center py-[24.5px] grid-cols-[minmax(120px,0.8fr)_minmax(150px,1.3fr)_minmax(200px,1.45fr)_minmax(100px,1fr)_minmax(100px,1fr)_minmax(100px,1fr)_120px_40px] border-b border-[#E5E7EB] bg-white"
                            >
                                {[...Array(8)].map((_, cellIndex) => (
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
                        className="sticky bottom-0 bg-[#fff]  pb-5 w-full ml-[0.2px]"
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
                        </div>
                    </motion.div>
                </section>
            </div>
        </>
    );
};

export default OrdersManagementTableSkeleton;