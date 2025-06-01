"use client";

import React from "react";
import { I18nProvider } from "@cloudscape-design/components/i18n";
import messages from "@cloudscape-design/components/i18n/messages/all.en";
import CloudscapeProvider from "@/app/components/CloudscapeProvider";
import "@cloudscape-design/global-styles/index.css";

const LOCALE = "en";

export default function LandingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <CloudscapeProvider>
      <I18nProvider locale={LOCALE} messages={[messages]}>
        {children}
      </I18nProvider>
    </CloudscapeProvider>
  );
}
