"use client";

import React from "react";
import { SideNavigation } from "@cloudscape-design/components";
import { navigationConfig } from "../config/navigation";

export default function Navigation() {
  return <SideNavigation {...navigationConfig} />;
}
