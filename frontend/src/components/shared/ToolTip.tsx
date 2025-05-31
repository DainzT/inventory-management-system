import { ReactNode, useState, useRef } from 'react';

interface TooltipProps {
    content: ReactNode;
    children: ReactNode;
    position?: 'top' | 'bottom' | 'left' | 'right';
    maxWidth?: string;
    delay?: number;
    showArrow?: boolean;
}

export const Tooltip = ({
    content,
    children,
    position = 'top',
    maxWidth = 'max-w-xs',
    delay = 700,
    showArrow = true,
}: TooltipProps) => {
    const [visible, setVisible] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);
    
    const showTooltip = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => setVisible(true), delay);
    };

    const hideTooltip = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
            if (!tooltipRef.current?.matches(':hover')) {
                setVisible(false);
            }
        }, 100);
    };

    const handleTooltipMouseEnter = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };

    const handleTooltipMouseLeave = () => {
        setVisible(false);
    };
    
    const positionClasses = {
        top: 'bottom-full mb-1 left-0',
        bottom: 'top-full mt-1 left-0',
        left: 'right-full mr-2 top-1/2 -translate-y-1/2',
        right: 'left-full ml-2 top-1/2 -translate-y-1/2',
    };

    return (
        <span className="relative inline-block">
            <span
                onMouseEnter={showTooltip}
                onMouseLeave={hideTooltip}
                className="inline-flex"
                aria-describedby={visible ? "tooltip-content" : undefined}
            >
                {children}
            </span>
            <div
                ref={tooltipRef}
                id="tooltip-content"
                role="tooltip"
                className={`absolute ${positionClasses[position]} z-50 px-3 py-2 text-sm text-white bg-gray-800 rounded-md shadow-lg ${maxWidth} break-words transition-opacity duration-200 ${visible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                style={{ wordBreak: "break-word" }}
                onMouseEnter={handleTooltipMouseEnter}
                onMouseLeave={handleTooltipMouseLeave}
            >
                {content}
                {showArrow && (
                    <div
                        className={`absolute w-2 h-2 bg-gray-800 transform rotate-45 ${position === 'top'
                            ? '-bottom-1 left-2'
                            : position === 'bottom'
                                ? '-top-1 left-2'
                                : position === 'left'
                                    ? '-right-1 top-1/2 -translate-y-1/2'
                                    : '-left-1 top-1/2 -translate-y-1/2'
                            }`}
                    />
                )}
            </div>
        </span>
    );
};
