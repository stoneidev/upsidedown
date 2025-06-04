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

export default function DevelopmentCycle() {
  const { setSplitPanel, setHelpPanel, setSplitPanelOpen } = useAppLayout();

  useEffect(() => {
    setSplitPanel({
      ...splitPanelConfig,
      header: "Development Cycle Details",
      children: "This is the content for Development Cycle",
    });
    setSplitPanelOpen(true);


    setHelpPanel({
      ...helpPanelConfig,
      header: "Development Cycle Help",
      children: "This is the help content for Development Cycle",
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
          Development Cycle
        </Header>
      }
    >
      <Container
        header={
          <Header variant="h2" description="Development Cycle description">
            Overview
          </Header>
        }
      >
        <div>Development Cycle content goes here</div>
      </Container>
    </ContentLayout>
  );
}
