// import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
// import "./globals.css";

import "@cloudscape-design/global-styles/index.css";
import CloudscapeProvider from "./components/CloudscapeProvider";

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
