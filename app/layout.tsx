import type { Metadata } from "next";
import { Space_Grotesk, Inter, Kanit } from "next/font/google"; // Added Kanit for that bold Slice look
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

// Adding Kanit for the extra bold/wide headers
const kanit = Kanit({
  variable: "--font-kanit",
  subsets: ["latin"],
  weight: ["400", "600", "800", "900"],
});

export const metadata: Metadata = {
  title: "Sona — Your Autonomous AI Agent for WhatsApp",
  description:
    "Sona is the AI agent that lives in your WhatsApp groups. It summarizes chats, extracts tasks, schedules meetings, and keeps your team on track — automatically.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${spaceGrotesk.variable} ${inter.variable} ${kanit.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
