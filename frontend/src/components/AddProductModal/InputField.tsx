interface InputFieldProps {
  label: string;
  required?: boolean;
  type?: "text" | "textarea";
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const InputField = ({
  label,
  required = false,
  type = "text",
  value,
  onChange,
  placeholder,
}: InputFieldProps) => {
  const inputStyles =
    "w-full mt-2 px-4 rounded-[8px] border-[1px] border-[#0FE3FF] bg-[#F4F1F1] inter-font";

  return (
    <div>
      <label className="text-[16px] font-bold inter-font">
          <span>{label}</span>
          {required && <span className="text-[#FF5757]">*</span>}
      </label>
      {type === "textarea" ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`${inputStyles} h-[76px] p-4`}
          style={{ resize: "none"}}
          required={required}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`${inputStyles} h-[40px]`}
          required={required}
        />
      )}
    </div>
  );
};
