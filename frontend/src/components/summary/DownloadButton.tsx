import { ClipLoader } from "react-spinners";

interface DownloadButtonProps {
    onDownload: () => void;
    isLoading: boolean;
}

export const DownloadButton = ({
    onDownload,
    isLoading = false,
}: DownloadButtonProps) => {

    return (
        <button
            className={`relative
            inline-flex font-medium items-center justify-center gap-2 px-4 py-3 text-base text-white
            rounded-md transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
            w-[200px] overflow-hidden 
            ${isLoading ? "cursor-wait bg-green-500/60" : "bg-green-500 hover:bg-green-600"}
            shadow-md hover:shadow-lg
            active:scale-[0.98] active:shadow-sm
            transform-gpu will-change-transform
        `}
            data-print-invoice="true"
            aria-label="Download invoice"
            onClick={onDownload}
        >
            <span className="absolute inset-0 overflow-hidden">
                <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
            </span>

            {isLoading ? (
                <>
                    <ClipLoader color="#ffffff" size={20} className="mr-2" />
                    Processing...
                </>
            ) : (
                <>
                    <svg className="w-5 h-5 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download Invoice
                </>
            )}
        </button>
    );
};