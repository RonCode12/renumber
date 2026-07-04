import clsx from "clsx";

export function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const textSize = size === "lg" ? "text-3xl" : size === "sm" ? "text-lg" : "text-2xl";
  const tagSize = size === "lg" ? "text-xs" : "text-[10px]";

  return (
    <div className="flex flex-col items-start" dir="ltr">
      <span
        className={clsx("font-extrabold leading-none tracking-tight text-slate-900", textSize)}
        style={{ fontFamily: "var(--font-baloo)" }}
      >
        renumber
      </span>
      <span className={clsx("font-semibold uppercase tracking-[0.2em] text-slate-400", tagSize)}>
        Marketing Agency
      </span>
    </div>
  );
}
