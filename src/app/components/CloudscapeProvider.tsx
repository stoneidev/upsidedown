"use client";

import { useEffect } from "react";
import { applyMode, Mode } from "@cloudscape-design/global-styles";

export default function CloudscapeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // apply a color mode
    applyMode(Mode.Light);
  }, []);

  return <>{children}</>;
}
