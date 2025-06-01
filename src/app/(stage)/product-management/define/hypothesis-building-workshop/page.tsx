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

export default function HypothesisBuildingWorkshop() {
  const { setSplitPanel, setHelpPanel } = useAppLayout();

  useEffect(() => {
    setSplitPanel({
      ...splitPanelConfig,
      header: "Hypothesis Building Workshop Details",
      children: "This is the content for Hypothesis Building Workshop",
    });

    setHelpPanel({
      ...helpPanelConfig,
      header: "Hypothesis Building Workshop Help",
      children: "This is the help content for Hypothesis Building Workshop",
    });

    return () => {
      setSplitPanel(null);
      setHelpPanel(null);
    };
  }, [setSplitPanel, setHelpPanel]);

  return (
    <ContentLayout
      header={
        <Header variant="h1" info={<Link variant="info">Info</Link>}>
          Hypothesis Building Workshop
        </Header>
      }
    >
      <Container
        header={
          <Header
            variant="h2"
            description="Hypothesis Building Workshop description"
          >
            Overview
          </Header>
        }
      >
        <div>Hypothesis Building Workshop content goes here</div>
      </Container>
    </ContentLayout>
  );
}
