import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://inventariano.com.br"),
  title: {
    default: "Inventariano | Inventário, Herança, Partilha e ITCMD",
    template: "%s | Inventariano",
  },
  description:
    "Informações, calculadoras e ferramentas sobre inventário, herança, partilha, ITCMD, meação e regularização de imóveis.",
  keywords: [
    "inventário",
    "inventário extrajudicial",
    "inventário judicial",
    "herança",
    "partilha",
    "ITCMD",
    "meação",
    "regularização de imóveis",
  ],
  alternates: {
    canonical: "https://inventariano.com.br",
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://inventariano.com.br",
    siteName: "Inventariano",
    title: "Inventariano | Inventário, Herança, Partilha e ITCMD",
    description:
      "Informações, calculadoras e ferramentas para compreender inventário, herança, partilha, ITCMD e regularização de imóveis.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <body>{children}</body>
    </html>
  );
}
