interface InputProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  placeholder?: string;
  className?: string; // Add this line
  type?: string;
}

export const Input = ({
  label,
  value,
  onChange,
  error,
  placeholder,
  className = '', // Provide default empty string
  type = 'text'
}: InputProps) => {
  return (
    <div className="flex flex-col space-y-1">
      <label className="text-sm font-medium text-earth-700">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`form-input rounded-lg ${className}`} // Use the className prop
        {...(error && { 'aria-invalid': true })}
      />
      {error && (
        <span className="text-sm text-red-500">{error}</span>
      )}
    </div>
  );
};
