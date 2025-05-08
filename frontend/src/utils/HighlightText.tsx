export const highlightText = (text: string, query: string) => {
    if (!query || !text) return text;
    
    const regex = new RegExp(`(${escapeRegExp(query)})`, 'i');
    const parts = text.toString().split(regex);
    
    // Find the index of the first match
    const firstMatchIndex = parts.findIndex(part => regex.test(part));
    
    return parts.map((part, index) =>
        index === firstMatchIndex ? (
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
