import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Prucka Treasure Hunt 2024",
  description: "Prucka Treasure Hunt Website for 2024, Created by Alex Prucka",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body className="theme-background">
        <div className="w-full">
          <div className="container mx-auto py-4 flex items-center justify-center">
            <img src="/favicon.ico" alt="Icon" className="w-6 h-6 mr-2" />
            <h1 className="text-center text-2xl font-bold">Prucka Treasure Hunt</h1>
            <img src="/favicon.ico" alt="Icon" className="w-6 h-6 ml-2" />
          </div>
        </div>
        {children}
        <div className="snowflakes" aria-hidden="true">
          {Array.from({ length: 10 }).map((_, index) => (
            <div key={index} className="snowflake">❄</div>
          ))}
        </div>
      </body>
    </html>
  );
}
