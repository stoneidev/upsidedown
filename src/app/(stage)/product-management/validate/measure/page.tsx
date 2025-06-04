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

export default function Measure() {
  const { setSplitPanel, setHelpPanel, setSplitPanelOpen } = useAppLayout();

  useEffect(() => {
    setSplitPanel({
      ...splitPanelConfig,
      header: "Measure Details",
      children: "This is the content for Measure",
    });
    setSplitPanelOpen(true);


    setHelpPanel({
      ...helpPanelConfig,
      header: "Measure Help",
      children: "This is the help content for Measure",
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
          Measure
        </Header>
      }
    >
      <Container
        header={
          <Header variant="h2" description="Measure description">
            Overview
          </Header>
        }
      >
        <div>Measure content goes here</div>
      </Container>
    </ContentLayout>
  );
}
