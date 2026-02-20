import type { Metadata } from "next";
import { Montserrat_Alternates, Quintessential } from "next/font/google";
import { Sidebar } from "@/components/feature/Sidebar";
import "./globals.css";

const montserratAlternates = Montserrat_Alternates({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-montserrat-alternates",
});

const quintessential = Quintessential({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-quintessential",
});

export const metadata: Metadata = {
  title: "The Drinking Man",
  description:
    "Explore a coquetelaria moderna com The Drinking Man. Uma coleção curada por um mixologista humano, potencializada por análise de dados e IA.",
  keywords: [
    "Mixologia",
    "Barman",
    "Coquetéis",
    "IA Sommelier",
    "Sugestor de Drinks",
    "Análise de Dados",
    "Receitas de Drinks",
    "The Drinking Man",
  ],
  authors: [{ name: "The Drinking Man Creator" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${montserratAlternates.variable} ${quintessential.variable} font-sans antialiased text-foreground`}
      >
        <Sidebar />
        {children}
      </body>
    </html>
  );
}
