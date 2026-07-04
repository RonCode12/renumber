import type { ReactNode, InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import clsx from "clsx";

export function RequiredStar() {
  return <span className="text-red-500 mr-1">*</span>;
}

export function FieldLabel({
  children,
  required,
}: {
  children: ReactNode;
  required?: boolean;
}) {
  return (
    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
      {children}
      {required && <RequiredStar />}
    </label>
  );
}

export function ErrorText({ children }: { children?: string }) {
  if (!children) return null;
  return <p className="text-xs text-red-500 mt-1">{children}</p>;
}

const inputBase =
  "w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:ring-2 focus:ring-sky-300 focus:border-sky-400";

function borderClass(error?: boolean) {
  return error ? "border-red-400" : "border-slate-200";
}

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  required?: boolean;
  error?: string;
}

export function TextField({ label, required, error, className, ...props }: TextFieldProps) {
  return (
    <div>
      {label && <FieldLabel required={required}>{label}</FieldLabel>}
      <input className={clsx(inputBase, borderClass(!!error), className)} {...props} />
      <ErrorText>{error}</ErrorText>
    </div>
  );
}

interface TextAreaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  required?: boolean;
  error?: string;
}

export function TextAreaField({
  label,
  required,
  error,
  className,
  rows = 4,
  ...props
}: TextAreaFieldProps) {
  return (
    <div>
      {label && <FieldLabel required={required}>{label}</FieldLabel>}
      <textarea
        rows={rows}
        className={clsx(inputBase, borderClass(!!error), "resize-y", className)}
        {...props}
      />
      <ErrorText>{error}</ErrorText>
    </div>
  );
}

interface NumberFieldProps {
  label?: string;
  required?: boolean;
  error?: string;
  value: number | null;
  onChange: (value: number | null) => void;
  placeholder?: string;
  min?: number;
  step?: number;
  suffix?: string;
}

export function NumberField({
  label,
  required,
  error,
  value,
  onChange,
  placeholder,
  min,
  step,
  suffix,
}: NumberFieldProps) {
  return (
    <div>
      {label && <FieldLabel required={required}>{label}</FieldLabel>}
      <div className="relative">
        <input
          type="number"
          inputMode="decimal"
          className={clsx(inputBase, borderClass(!!error), suffix && "pl-10")}
          value={value ?? ""}
          min={min}
          step={step ?? "any"}
          placeholder={placeholder}
          onChange={(e) => {
            const v = e.target.value;
            onChange(v === "" ? null : Number(v));
          }}
        />
        {suffix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
            {suffix}
          </span>
        )}
      </div>
      <ErrorText>{error}</ErrorText>
    </div>
  );
}

interface SelectFieldProps {
  label?: string;
  required?: boolean;
  error?: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export function SelectField({
  label,
  required,
  error,
  value,
  onChange,
  options,
  placeholder,
}: SelectFieldProps) {
  return (
    <div>
      {label && <FieldLabel required={required}>{label}</FieldLabel>}
      <select
        className={clsx(inputBase, borderClass(!!error), "cursor-pointer")}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <ErrorText>{error}</ErrorText>
    </div>
  );
}

interface RadioGroupProps {
  label?: string;
  required?: boolean;
  error?: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}

export function RadioGroup({
  label,
  required,
  error,
  value,
  onChange,
  options,
}: RadioGroupProps) {
  return (
    <div>
      {label && <FieldLabel required={required}>{label}</FieldLabel>}
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const active = value === opt.value;
          return (
            <button
              type="button"
              key={opt.value}
              onClick={() => onChange(opt.value)}
              className={clsx(
                "rounded-full border px-4 py-2 text-sm font-medium transition",
                active
                  ? "border-sky-400 bg-sky-50 text-sky-700 ring-2 ring-sky-200"
                  : "border-slate-200 bg-white text-slate-600 hover:border-sky-200 hover:bg-sky-50/50"
              )}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
      <ErrorText>{error}</ErrorText>
    </div>
  );
}

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
}

export function Button({ variant = "primary", className, ...props }: ButtonProps) {
  const variants: Record<string, string> = {
    primary:
      "bg-sky-500 text-white hover:bg-sky-600 shadow-sm shadow-sky-200 disabled:bg-slate-300",
    secondary:
      "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50",
    danger: "bg-white text-red-500 border border-red-200 hover:bg-red-50",
    ghost: "text-slate-500 hover:bg-slate-100",
  };
  return (
    <button
      className={clsx(
        "rounded-lg px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}

export function Card({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        "rounded-2xl border border-slate-200 bg-white p-6 shadow-sm",
        className
      )}
    >
      {children}
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-slate-800">{title}</h1>
      {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
    </div>
  );
}
