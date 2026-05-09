import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";

const sora = localFont({
  src: "../../public/fonts/Sora-VariableFont_wght.ttf",
  variable: "--font-sora",
  weight: "100 800",
  display: "block",
  preload: true,
});

export const metadata: Metadata = {
  title: "Planetário",
  description: "Sistema financeiro interno Planeta Cargas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning className={sora.variable}>
      <body className="antialiased">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
