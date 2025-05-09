interface ButtonProps {
  variant?: "primary" | "secondary";
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  className?: string;
  disabled?: boolean;
}

export const Button = ({
  variant = "primary",
  children,
  onClick,
  className,
  type = "button",
  disabled = false,
}: ButtonProps) => {
  const baseStyles = "px-6 py-2 rounded-[5px]";
  const variantStyles = {
    primary: ` ${disabled ? "bg-[#1B626E]/60 text-white/60 cursor-not-allowed": "bg-[#1B626E] text-white cursor-pointer hover:bg-[#297885] active:bg-[#145965]"} transition-colors `,
    secondary: "border-[1px] border-[#1B626E] cursor-pointer text-[#1B626E] transition-colors hover:bg-[#1B626E]/5 active:bg-[#1B626E]/10",
  };
  return (
    <button
      type={type}
      onClick={onClick}
      className={`inter-font ${baseStyles} ${variantStyles[variant]} ${className}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

