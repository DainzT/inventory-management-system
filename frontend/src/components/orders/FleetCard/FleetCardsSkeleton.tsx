import { motion } from "framer-motion";

const FleetCardsSkeleton = () => {
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
        <div className="flex justify-center items-center h-[200px]">
            <div className="justify-start items-center flex gap-16">
                {[1, 2, 3].map((_, index) => (
                    <motion.article
                        key={index}
                        variants={shimmerVariants}
                        initial="initial"
                        animate="animate"
                        className={`relative p-4 rounded-xl h-[170px] w-[300px] cursor-pointer shadow-lg overflow-hidden`}
                        style={{
                            background: "linear-gradient(90deg, #e0e0e0 25%, #d0d0d0 50%, #e0e0e0 75%)",
                            backgroundSize: "200% 100%",
                        }}
                    >
                        <motion.div
                            className="h-8 w-3/4 bg-gray-300 rounded mb-2"
                            style={{ opacity: 0.7 }}
                        />
                        <motion.div
                            className="h-4 w-1/2 bg-gray-300 rounded"
                            style={{ opacity: 0.7 }}
                        />
                        <div className="absolute bottom-[10px] right-[14px] opacity-[0.3]">
                            <svg
                                width="115"
                                height="115"
                                viewBox="0 0 115 115"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <g opacity="0.3">
                                    <path
                                        d="M71.7188 62.7538V32.6543C71.7147 32.2885 71.8227 31.9301 72.0282 31.6273C72.2337 31.3246 72.5269 31.092 72.8685 30.9607C73.21 30.8295 73.5836 30.8059 73.9389 30.8931C74.2943 30.9803 74.6145 31.1741 74.8565 31.4486L99.5098 58.5493C100.076 59.1714 100.406 59.973 100.441 60.8138C100.477 61.6545 100.215 62.4809 99.7025 63.1483C99.3509 63.5918 98.9021 63.9485 98.3907 64.191C97.8793 64.4335 97.319 64.5552 96.7531 64.5468H73.5118C73.0362 64.5468 72.5802 64.3579 72.2439 64.0216C71.9077 63.6854 71.7188 63.2293 71.7188 62.7538ZM110.81 77.3351C110.517 76.7267 110.058 76.2134 109.487 75.8542C108.915 75.4949 108.253 75.3045 107.578 75.3046H64.5469V3.58584C64.5429 2.84668 64.3106 2.12683 63.8818 1.52478C63.4529 0.922736 62.8485 0.46792 62.1513 0.222579C61.454 -0.0227612 60.698 -0.0466386 59.9866 0.154215C59.2753 0.355069 58.6434 0.770839 58.1774 1.34462L11.5602 58.7196C11.1388 59.246 10.8743 59.8805 10.7971 60.5503C10.7199 61.2201 10.8331 61.8981 11.1237 62.5065C11.4144 63.115 11.8707 63.6291 12.4402 63.99C13.0098 64.3509 13.6695 64.5438 14.3438 64.5468H57.375V75.3046H7.17192C6.49614 75.3042 5.834 75.4947 5.2618 75.8543C4.68961 76.2138 4.23066 76.7277 3.93784 77.3368C3.64503 77.9458 3.53028 78.6252 3.60681 79.2966C3.68334 79.9681 3.94805 80.6042 4.37041 81.1317L17.6384 97.7167C18.3088 98.5577 19.1605 99.2363 20.1299 99.702C21.0993 100.168 22.1614 100.408 23.2369 100.406H91.5132C92.5886 100.408 93.6507 100.168 94.6202 99.702C95.5896 99.2363 96.4413 98.5577 97.1117 97.7167L110.38 81.1317C110.802 80.6038 111.066 79.9673 111.143 79.2955C111.219 78.6238 111.103 77.9442 110.81 77.3351Z"
                                        fill="white"
                                    />
                                </g>
                            </svg>
                        </div>
                    </motion.article>
                ))}
            </div>
        </div>
    );
}

export default FleetCardsSkeleton;