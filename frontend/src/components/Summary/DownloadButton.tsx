interface DownloadButtonProps {
    onDownload: () => void;
}

export const DownloadButton = ({
    onDownload,
}: DownloadButtonProps) => {
    return (
        <button
        className="
            inline-flex font-medium items-center justify-center gap-2 px-4 py-3 text-base text-white
            rounded-md cursor-pointer transition-colors duration-200 group
            bg-green-500 hover:bg-green-600  
        "
        
        data-print-invoice="true"
        aria-label="Download invoice"
        onClick={onDownload}
    >
        Download Invoice
        
        <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className="group-hover:translate-y-0.5 transition-transform duration-200"
        >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
</button>  
    );
};