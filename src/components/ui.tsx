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
    <label className="block text-[13px] font-semibold text-slate-600 mb-1.5">
      {children}
      {required && <RequiredStar />}
    </label>
  );
}

export function ErrorText({ children }: { children?: string }) {
  if (!children) return null;
  return <p className="text-xs font-medium text-red-500 mt-1">{children}</p>;
}

const inputBase =
  "w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-shadow duration-150 focus:ring-4 focus:ring-amber-100 focus:border-amber-400";

function borderClass(error?: boolean) {
  return error ? "border-red-300" : "border-slate-200";
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
        className={clsx(inputBase, borderClass(!!error), "resize-y leading-relaxed", className)}
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
          className={clsx(inputBase, borderClass(!!error), suffix && "pl-11")}
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
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
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
                "rounded-full border px-4 py-2 text-sm font-medium transition-all",
                active
                  ? "border-amber-400 bg-amber-400 text-slate-900 shadow-sm shadow-amber-200"
                  : "border-slate-200 bg-white text-slate-600 hover:border-amber-300 hover:bg-amber-50/60"
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
      "bg-amber-400 text-slate-900 hover:bg-amber-500 shadow-md shadow-amber-200/70 hover:shadow-lg hover:shadow-amber-200 active:scale-[0.98] disabled:bg-slate-200 disabled:shadow-none disabled:text-slate-400",
    secondary:
      "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 active:scale-[0.98]",
    danger: "bg-white text-red-500 border border-red-200 hover:bg-red-50 active:scale-[0.98]",
    ghost: "text-slate-500 hover:bg-slate-100 active:scale-[0.98]",
  };
  return (
    <button
      className={clsx(
        "rounded-xl px-4 py-2.5 text-sm font-bold transition-all duration-150 disabled:cursor-not-allowed disabled:active:scale-100",
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
        "rounded-2xl border border-slate-200/80 bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_-12px_rgba(15,23,42,0.08)]",
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
      <h1 className="text-[1.6rem] font-extrabold tracking-tight text-slate-800">{title}</h1>
      {subtitle && <p className="mt-1.5 text-sm text-slate-500">{subtitle}</p>}
    </div>
  );
}
