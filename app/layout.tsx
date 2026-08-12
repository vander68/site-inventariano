import type { Metadata } from "next";
import { Playfair_Display, Lato } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"],
  display: "swap",
});

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  display: "swap",
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
    <html lang="pt-BR" className={`${playfair.variable} ${lato.variable} antialiased`}>
      <body>{children}</body>
    </html>
  );
}
