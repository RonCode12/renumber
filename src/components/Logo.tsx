import clsx from "clsx";

export function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const textSize = size === "lg" ? "text-3xl" : size === "sm" ? "text-lg" : "text-2xl";
  const tagSize = size === "lg" ? "text-xs" : "text-[10px]";
  const dotSize = size === "lg" ? "h-2 w-2" : "h-1.5 w-1.5";

  return (
    <div className="flex flex-col items-start" dir="ltr">
      <div className={clsx("flex items-baseline font-extrabold leading-none tracking-tight", textSize)} style={{ fontFamily: "var(--font-baloo)" }}>
        <span className="text-slate-900">Ren</span>
        <span className="relative mx-0.5 inline-flex items-center justify-center rounded-full bg-amber-400 px-1.5 text-slate-900">
          u
          <span className={clsx("absolute -top-1 -right-0.5 rounded-full bg-slate-900", dotSize)} />
        </span>
        <span className="text-slate-900">mber</span>
      </div>
      <span className={clsx("font-semibold uppercase tracking-[0.2em] text-slate-400", tagSize)}>
        Marketing Agency
      </span>
    </div>
  );
}
