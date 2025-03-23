import { Link } from "react-router-dom";

    interface NavigationItemProps {
        path: string;
        currentPath: string;
        icon: React.ReactNode;
        label: string;
        onClick: () => void;
        disabled?: boolean;
    }
    
  

  export const NavigationItem: React.FC<NavigationItemProps> = ({
    path,
    currentPath,
    icon,
    label,
    onClick,
    disabled,
  }) => {
    const isActive = currentPath === path;
  
    return (
        <Link
        to={path}
        onClick={(e) => {
            if (disabled) {
            e.preventDefault(); 
            } else {
            onClick(); 
            }
        }}
            className={`flex items-center gap-3 w-full h-[72px] px-10 py-2 text-lg font-medium text-black transition-all duration-200 ease-in-out ${
                isActive ? "bg-[#295C65] text-white" : ""
            } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
        >
            {icon} {label}
        </Link>
    );
};