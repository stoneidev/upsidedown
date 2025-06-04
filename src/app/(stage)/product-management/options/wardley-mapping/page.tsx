"use client";

import React, { useEffect } from "react";
import {
  Container,
  ContentLayout,
  Header,
  Link,
} from "@cloudscape-design/components";
import { useAppLayout } from "@/app/context/AppLayoutContext";
import { splitPanelConfig } from "@/app/config/splitPanel";
import { helpPanelConfig } from "@/app/config/helpPanel";

export default function WardleyMapping() {
  const { setSplitPanel, setHelpPanel, setSplitPanelOpen } = useAppLayout();

  useEffect(() => {
    setSplitPanel({
      ...splitPanelConfig,
      header: "Wardley Mapping Details",
      children: "This is the content for Wardley Mapping",
    });
    setSplitPanelOpen(true);


    setHelpPanel({
      ...helpPanelConfig,
      header: "Wardley Mapping Help",
      children: "This is the help content for Wardley Mapping",
    });

    return () => {
      setSplitPanel(null);
      setHelpPanel(null);
      setSplitPanelOpen(false);
    };
  }, [setSplitPanel, setHelpPanel, setSplitPanelOpen]);

  return (
    <ContentLayout
      header={
        <Header variant="h1" info={<Link variant="info">Info</Link>}>
          Wardley Mapping
        </Header>
      }
    >
      <Container
        header={
          <Header variant="h2" description="Wardley Mapping description">
            Overview
          </Header>
        }
      >
        <div>Wardley Mapping content goes here</div>
      </Container>
    </ContentLayout>
  );
}
