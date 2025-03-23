interface InputFieldProps {
  label: string;
  required?: boolean;
  type?: "text" | "textarea";
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
}

export const InputField = ({
  label,
  required = false,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
}: InputFieldProps) => {
  const inputStyles =
    `w-full mt-1 px-4 rounded-[8px] border-[1px] border-[#0FE3FF] bg-[#F4F1F1] inter-font  
    ${error ? "border-red-500" : "border-[#0FE3FF]"}`;

  return (
    <div>
      <label className="text-base font-bold inter-font">
          <span>{label}</span>
          {required && <span className="text-[#FF5757]">*</span>}
      </label>
      {type === "textarea" ? (
        <>
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={`${inputStyles} h-[76px] p-4`}
            style={{ resize: "none"}}
          />
            {error && <p className="absolute text-red-600 text-sm">{error}</p>}
        </>
      ) : (
        <>
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={`${inputStyles} h-[40px]`}
          />
          {error && <p className="absolute text-red-600 text-sm">{error}</p>}
        </>
      )}
    </div>
  );
};
