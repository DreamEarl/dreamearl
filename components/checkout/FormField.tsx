import { InputHTMLAttributes } from "react";

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export default function FormField({
  label,
  error,
  id,
  className = "",
  ...props
}: Readonly<FormFieldProps>) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-xs tracking-widest text-gray-600">
        {label}
      </label>
      <input
        id={id}
        aria-invalid={Boolean(error)}
        className={`w-full border px-4 py-3 text-sm focus:outline-none focus:border-black ${
          error ? "border-red-400" : "border-gray-300"
        } ${className}`}
        {...props}
      />
      {error && (
        <span role="alert" className="text-xs text-red-600">
          {error}
        </span>
      )}
    </div>
  );
}
