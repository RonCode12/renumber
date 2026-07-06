import Image from "next/image";

const HEIGHTS = { sm: 28, md: 36, lg: 48 } as const;
const ASPECT_RATIO = 808 / 271;

export function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const height = HEIGHTS[size];
  const width = Math.round(height * ASPECT_RATIO);

  return (
    <Image
      src="/logo.png"
      alt="Renumber Marketing Agency"
      width={width}
      height={height}
      priority
    />
  );
}
