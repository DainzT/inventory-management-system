import React from "react";

interface ThreeDotsLoaderProps {
  className?: string;
}

export const ThreeDotsLoader: React.FC<ThreeDotsLoaderProps> = ({
  className = "",
}) => {
  return (
    <div className={`flex gap-1 items-center ${className}`}>
      <div className="w-2 h-2 rounded-full bg-cyan-800 animate-bounce1"></div>
      <div className="w-2 h-2 rounded-full bg-cyan-800 animate-bounce2"></div>
      <div className="w-2 h-2 rounded-full bg-cyan-800 animate-bounce3"></div>
    </div>
  );
};

export default ThreeDotsLoader;
