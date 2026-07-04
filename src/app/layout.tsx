import type { Metadata } from "next";
import { Assistant, Baloo_2 } from "next/font/google";
import "./globals.css";

const assistant = Assistant({
  variable: "--font-assistant",
  subsets: ["hebrew", "latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const baloo = Baloo_2({
  variable: "--font-baloo",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Renumber | מערכת תוכניות עבודה לקמפיינים",
  description: "מערכת פנימית להזנת תוכניות עבודה חודשיות ותוכניות ליום מכירות",
  icons: {
    icon:
      "data:image/svg+xml," +
      encodeURIComponent(
        `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><rect width='64' height='64' rx='16' fill='#fbbf24'/><text x='32' y='44' font-family='Arial, sans-serif' font-size='34' font-weight='800' fill='#1c1917' text-anchor='middle'>R</text></svg>`
      ),
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      dir="rtl"
      lang="he"
      className={`${assistant.variable} ${baloo.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#fbf9f6] text-slate-900 font-sans">
        {children}
      </body>
    </html>
  );
}
