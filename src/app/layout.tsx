import "~/styles/globals.css";
import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { ClerkProvider, SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { HeaderTitle } from "~/app/_components/HeaderTitle";

export const metadata: Metadata = {
  title: "Prucka Treasure Hunt 2024",
  description: "Prucka Treasure Hunt Website for 2024, Created by Alex Prucka",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${GeistSans.variable}`}>
        <body className="theme-background">
          <div className="w-full">
            <HeaderTitle />
          </div>
          <SignedOut>
            <div className="hidden">
              <SignInButton />
            </div>
          </SignedOut>
          <SignedIn>
            <div className="hidden">
              <UserButton />
            </div>
          </SignedIn>
          {children}
          <div className="snowflakes" aria-hidden="true">
            {Array.from({ length: 10 }).map((_, index) => (
              <div key={index} className="snowflake">❄</div>
            ))}
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
