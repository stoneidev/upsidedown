// import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
// import "./globals.css";

import CloudscapeProvider from "./components/CloudscapeProvider";
import "@cloudscape-design/global-styles/index.css";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <CloudscapeProvider>{children}</CloudscapeProvider>
      </body>
    </html>
  );
}
