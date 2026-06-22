import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AlertsProvider } from "@/context/AlertsContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "SISP — Sistema Inteligente de Salud Preventiva",
  description:
    "Dashboard médico para monitoreo de pacientes crónicos mediante dispositivos IoMT y predicción de riesgo con Machine Learning.",
  keywords: ["salud preventiva", "IoMT", "machine learning", "monitoreo pacientes"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} h-full`}>
      <body className="min-h-full">
        <AlertsProvider>
          {children}
        </AlertsProvider>
      </body>
    </html>
  );
}

