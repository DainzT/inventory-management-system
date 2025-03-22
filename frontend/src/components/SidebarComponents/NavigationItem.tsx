import { Link } from "react-router-dom";

    interface NavigationItemProps {
        path: string;
        currentPath: string;
        icon: React.ReactNode;
        label: string;
        onClick: () => void;
    }
    
  

  export const NavigationItem: React.FC<NavigationItemProps> = ({
    path,
    currentPath,
    icon,
    label,
    onClick,
  }) => {
    const isActive = currentPath === path;
  
    return (
        <Link
            to={path}
            onClick={onClick}
            className={`flex items-center gap-3 w-full h-[72px] px-10 py-2 text-lg font-medium text-black transition-all duration-200 ease-in-out  ${
                isActive ? "bg-[#295C65] text-white" : ""
            }`}
        >
        {icon}

        {label}
        </Link>
    );
};