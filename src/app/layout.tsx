import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { StateProvider } from "@/context/StateContext";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cake Bae | Custom Cakes Colombo",
  description: "Cake Bae by Savi Wijayalath - Beautiful custom celebration cakes, bento cakes, and gourmet desserts delivered in Colombo.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} font-outfit h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-950">
        <StateProvider>
          {children}
        </StateProvider>
      </body>
    </html>
  );
}
