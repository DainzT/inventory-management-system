import { motion } from "framer-motion";

const SummaryDesignSkeleton = () => {
    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 0 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.3 },
        },
    };

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
        <motion.main
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="p-0 sm:p-7 h-full flex flex-col"
        >
            <motion.div
                variants={itemVariants}
                className="p-7 flex-1 border-[1px] border-[#E5E7EB] bg-white shadow-[0px_4px_6px_0px_rgba(0,0,0,0.05)] rounded-[5px]"
            >
                <section className="flex flex-col gap-4">
                    <div className="h-8 w-1/3 bg-gray-200 rounded-md overflow-hidden">
                        <motion.div
                            variants={shimmerVariants}
                            initial="initial"
                            animate="animate"
                            className="h-full w-full"
                            style={{
                                background:
                                    "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
                                backgroundSize: "200% 100%",
                            }}
                        />
                    </div>
                    <div className="flex gap-2">
                        <div className="h-12 w-24 bg-gray-200 rounded-md overflow-hidden">
                            <motion.div
                                variants={shimmerVariants}
                                initial="initial"
                                animate="animate"
                                className="h-full w-full"
                                style={{
                                    background:
                                        "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
                                    backgroundSize: "200% 100%",
                                }}
                            />
                        </div>
                    </div>
                </section>
                <section className="flex flex-col gap-3 text-[0.9em] sm:text-[1em]">
                    <div className="mt-4 h-8 w-1/3 bg-gray-200 rounded-md overflow-hidden">
                        <motion.div
                            variants={shimmerVariants}
                            initial="initial"
                            animate="animate"
                            className="h-full w-full"
                            style={{
                                background:
                                    "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
                                backgroundSize: "200% 100%",
                            }}
                        />
                    </div>
                    <div className="grid grid-cols-4 gap-2 max-sm:grid-cols-2">
                        {months.map((month) => (
                            <div
                                key={month}
                                className="h-12 bg-gray-200 rounded-md overflow-hidden"
                            >
                                <motion.div
                                    variants={shimmerVariants}
                                    initial="initial"
                                    animate="animate"
                                    className="h-full w-full"
                                    style={{
                                        background:
                                            "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
                                        backgroundSize: "200% 100%",
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                </section>
            </motion.div>

            <motion.div
                variants={itemVariants}
                className="flex flex-col items-center p-10"
            >
                <div className="flex items-center gap-4 mb-4">
                    <div className="h-10 w-20 bg-gray-200 rounded-md overflow-hidden">
                        <motion.div
                            variants={shimmerVariants}
                            initial="initial"
                            animate="animate"
                            className="h-full w-full"
                            style={{
                                background:
                                    "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
                                backgroundSize: "200% 100%",
                            }}
                        />
                    </div>
                    <div className="h-6 w-16 bg-gray-200 rounded-md overflow-hidden">
                        <motion.div
                            variants={shimmerVariants}
                            initial="initial"
                            animate="animate"
                            className="h-full w-full"
                            style={{
                                background:
                                    "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
                                backgroundSize: "200% 100%",
                            }}
                        />
                    </div>
                    <div className="h-10 w-20 bg-gray-200 rounded-md overflow-hidden">
                        <motion.div
                            variants={shimmerVariants}
                            initial="initial"
                            animate="animate"
                            className="h-full w-full"
                            style={{
                                background:
                                    "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
                                backgroundSize: "200% 100%",
                            }}
                        />
                    </div>
                    <div className="ml-4 flex items-center">
                        <div className="h-6 w-12 bg-gray-200 rounded-md overflow-hidden mr-2">
                            <motion.div
                                variants={shimmerVariants}
                                initial="initial"
                                animate="animate"
                                className="h-full w-full"
                                style={{
                                    background:
                                        "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
                                    backgroundSize: "200% 100%",
                                }}
                            />
                        </div>
                        <div className="h-10 w-16 bg-gray-200 rounded-md overflow-hidden">
                            <motion.div
                                variants={shimmerVariants}
                                initial="initial"
                                animate="animate"
                                className="h-full w-full"
                                style={{
                                    background:
                                        "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
                                    backgroundSize: "200% 100%",
                                }}
                            />
                        </div>
                    </div>
                </div>

                <motion.div
                    variants={shimmerVariants}
                    initial="initial"
                    animate="animate"
                    className="w-[894px] h-[1160px] p-4 rounded-lg  bg-gray-50 overflow-hidden"
                >
                    <div className="mt-3 flex flex-col p-6 mx-auto bg-white rounded border border-stone-300 w-[794px] h-[1123px]">
                        <header className="flex justify-between items-center mb-8">
                            <div className="flex flex-col gap-2">
                                <motion.div
                                    variants={shimmerVariants}
                                    initial="initial"
                                    animate="animate"
                                    className="h-10 w-64 rounded bg-gray-300"
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
                                    className="h-8 w-32 rounded bg-gray-300"
                                    style={{
                                        background:
                                            "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
                                        backgroundSize: "200% 100%",
                                    }}
                                />
                            </div>
                            <div className="flex flex-col gap-2 items-end">
                                <motion.div
                                    variants={shimmerVariants}
                                    initial="initial"
                                    animate="animate"
                                    className="h-10 w-28 rounded bg-gray-300"
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
                                    className="h-8 w-20 rounded bg-gray-300"
                                    style={{
                                        background:
                                            "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
                                        backgroundSize: "200% 100%",
                                    }}
                                />
                            </div>
                        </header>

                        <div className="flex-grow space-y-4">
                            <motion.div
                                variants={shimmerVariants}
                                initial="initial"
                                animate="animate"
                                className="h-8 bg-gray-300 rounded"
                                style={{
                                    background:
                                        "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
                                    backgroundSize: "200% 100%",
                                }}
                            />
                            {[...Array(2)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    variants={shimmerVariants}
                                    initial="initial"
                                    animate="animate"
                                    className="h-6 bg-gray-200 rounded"
                                    style={{
                                        background:
                                            "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
                                        backgroundSize: "200% 100%",
                                    }}
                                />
                            ))}
                        </div>

                    </div>
                </motion.div>

                <div className="mt-8 flex justify-center">
                    <div className="h-12 w-48 bg-gray-200 rounded-md overflow-hidden">
                        <motion.div
                            variants={shimmerVariants}
                            initial="initial"
                            animate="animate"
                            className="h-full w-full"
                            style={{
                                background:
                                    "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
                                backgroundSize: "200% 100%",
                            }}
                        />
                    </div>
                </div>
            </motion.div>
        </motion.main>
    );
};

export default SummaryDesignSkeleton;
