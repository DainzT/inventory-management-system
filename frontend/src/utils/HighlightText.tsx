export const highlightText = (text: string, query: string) => {
    if (!query || !text) return text;
    
    const regex = new RegExp(`(${escapeRegExp(query)})`, 'gi');
    return text.toString().split(regex).map((part, index) =>
        regex.test(part) ? (
            <span key={index} className="bg-yellow-200 font-semibold">
                {part}
            </span>
        ) : (
            part
        )
    );
};

function escapeRegExp(string: string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
