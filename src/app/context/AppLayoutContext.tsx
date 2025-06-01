"use client";

import React, { createContext, useContext, useState } from "react";
import {
  SplitPanelProps,
  HelpPanelProps,
  FlashbarProps,
} from "@cloudscape-design/components";

interface AppLayoutContextType {
  splitPanel: SplitPanelProps | null;
  setSplitPanel: (panel: SplitPanelProps | null) => void;
  helpPanel: HelpPanelProps | null;
  setHelpPanel: (panel: HelpPanelProps | null) => void;
  notifications: FlashbarProps["items"] | null;
  setNotifications: (items: FlashbarProps["items"] | null) => void;
}

const AppLayoutContext = createContext<AppLayoutContextType | undefined>(
  undefined
);

export function AppLayoutProvider({ children }: { children: React.ReactNode }) {
  const [splitPanel, setSplitPanel] = useState<SplitPanelProps | null>(null);
  const [helpPanel, setHelpPanel] = useState<HelpPanelProps | null>(null);
  const [notifications, setNotifications] = useState<
    FlashbarProps["items"] | null
  >(null);

  return (
    <AppLayoutContext.Provider
      value={{
        splitPanel,
        setSplitPanel,
        helpPanel,
        setHelpPanel,
        notifications,
        setNotifications,
      }}
    >
      {children}
    </AppLayoutContext.Provider>
  );
}

export function useAppLayout() {
  const context = useContext(AppLayoutContext);
  if (context === undefined) {
    throw new Error("useAppLayout must be used within an AppLayoutProvider");
  }
  return context;
}
