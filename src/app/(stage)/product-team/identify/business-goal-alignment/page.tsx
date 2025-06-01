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

export default function BusinessGoalAlignment() {
  const { setSplitPanel, setHelpPanel } = useAppLayout();

  useEffect(() => {
    setSplitPanel({
      ...splitPanelConfig,
      header: "Business Goal Alignment Details",
      children: "This is the content for Business Goal Alignment",
    });

    setHelpPanel({
      ...helpPanelConfig,
      header: "Business Goal Alignment Help",
      children: "This is the help content for Business Goal Alignment",
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
          Business Goal Alignment
        </Header>
      }
    >
      <Container
        header={
          <Header
            variant="h2"
            description="Business Goal Alignment description"
          >
            Overview
          </Header>
        }
      >
        <div>Business Goal Alignment content goes here</div>
      </Container>
    </ContentLayout>
  );
}
