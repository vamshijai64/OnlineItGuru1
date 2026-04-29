import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Learn & Succeed | Modern EdTech Platform",
  description: "Explore detailed syllabus, enroll in career-transforming programs, and track your success with our professional training platform.",
  openGraph: {
    title: "Learn & Succeed | Professional Training Platform",
    description: "Your journey to professional success starts here. Explore our industry-leading courses.",
    type: "website",
  },
};

import AppWrapper from "@/components/layout/AppWrapper";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${outfit.variable} font-inter antialiased`}
      >
        <AppWrapper>
          {children}
        </AppWrapper>
      </body>
    </html>
  );
}
