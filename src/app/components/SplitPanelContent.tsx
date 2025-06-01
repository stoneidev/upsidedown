"use client";

import React from "react";
import { SplitPanel } from "@cloudscape-design/components";
import { splitPanelConfig } from "../config/splitPanel";

export default function SplitPanelContent() {
  return <SplitPanel {...splitPanelConfig} />;
}
