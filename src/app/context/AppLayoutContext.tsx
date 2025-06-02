"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import {
  HelpPanelProps,
  FlashbarProps,
  SplitPanelProps,
} from "@cloudscape-design/components";

type FlashbarItem = NonNullable<FlashbarProps["items"]>[number];

interface AppLayoutContextType {
  splitPanel: SplitPanelProps | null;
  setSplitPanel: (splitPanel: SplitPanelProps | null) => void;
  helpPanel: HelpPanelProps | null;
  setHelpPanel: (helpPanel: HelpPanelProps | null) => void;
  notifications: FlashbarItem[] | null;
  setNotifications: (notifications: FlashbarItem[] | null) => void;
  splitPanelOpen: boolean;
  setSplitPanelOpen: (open: boolean) => void;
}

const AppLayoutContext = createContext<AppLayoutContextType | undefined>(
  undefined
);

export function AppLayoutProvider({ children }: { children: ReactNode }) {
  const [splitPanel, setSplitPanel] = useState<SplitPanelProps | null>(null);
  const [helpPanel, setHelpPanel] = useState<HelpPanelProps | null>(null);
  const [notifications, setNotifications] = useState<FlashbarItem[] | null>(
    null
  );
  const [splitPanelOpen, setSplitPanelOpen] = useState(false);

  return (
    <AppLayoutContext.Provider
      value={{
        splitPanel,
        setSplitPanel,
        helpPanel,
        setHelpPanel,
        notifications,
        setNotifications,
        splitPanelOpen,
        setSplitPanelOpen,
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
