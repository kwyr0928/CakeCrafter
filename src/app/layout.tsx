import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { AudioProvider } from './context/AudioContext';

export const metadata: Metadata = {
  title: "CAKE CRAFTER",
  description: "CAKE CRAFTER",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja" className={`${GeistSans.variable}`}>
      <body className="flex w-full h-screen justify-center items-center text-black1">
      <AudioProvider>
        {children}
      </AudioProvider>
      </body>
    </html>
  );
}
