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

export default function EngagementAlignmentWorkshop() {
  const { setSplitPanel, setHelpPanel } = useAppLayout();

  useEffect(() => {
    setSplitPanel({
      ...splitPanelConfig,
      header: "Engagement Alignment Workshop Details",
      children: "This is the content for Engagement Alignment Workshop",
    });

    setHelpPanel({
      ...helpPanelConfig,
      header: "Engagement Alignment Workshop Help",
      children: "This is the help content for Engagement Alignment Workshop",
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
          Engagement Alignment Workshop
        </Header>
      }
    >
      <Container
        header={
          <Header
            variant="h2"
            description="Engagement Alignment Workshop description"
          >
            Overview
          </Header>
        }
      >
        <div>Engagement Alignment Workshop content goes here</div>
      </Container>
    </ContentLayout>
  );
}
