import { Bricolage_Grotesque, JetBrains_Mono, Geist } from "next/font/google";
import "./globals.css";

// Display: expressive optical-size grotesque for the huge stacked name.
const display = Bricolage_Grotesque({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

// Label: mono for the film-credit style tagline, controls and scroll cue.
const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

// Body: restrained sans for the role subtitle and supporting copy.
const body = Geist({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata = {
  title: "Yashwant Yadav — AI Engineer",
  description:
    "Portfolio of Yashwant Yadav — AI & software engineer building machine learning and computer vision systems that turn data into real-world decisions.",
};

export const viewport = {
  themeColor: "#08070a",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${mono.variable} ${body.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
