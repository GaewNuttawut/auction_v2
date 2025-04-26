import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "./Providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "NutKan Auction",
  description: "Furniture auction website and sell furniture",
};

export default function RootLayout({children}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased `}
      >
        <AuthProvider>
            {children}
        </AuthProvider>
      </body>
    </html>
  );
}
