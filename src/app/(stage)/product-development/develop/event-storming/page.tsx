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

export default function EventStorming() {
  const { setSplitPanel, setHelpPanel } = useAppLayout();

  useEffect(() => {
    setSplitPanel({
      ...splitPanelConfig,
      header: "Event Storming Details",
      children: "This is the content for Event Storming",
    });

    setHelpPanel({
      ...helpPanelConfig,
      header: "Event Storming Help",
      children: "This is the help content for Event Storming",
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
          Event Storming
        </Header>
      }
    >
      <Container
        header={
          <Header variant="h2" description="Event Storming description">
            Overview
          </Header>
        }
      >
        <div>Event Storming content goes here</div>
      </Container>
    </ContentLayout>
  );
}
