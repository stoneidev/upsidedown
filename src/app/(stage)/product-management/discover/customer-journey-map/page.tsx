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

export default function CustomerJourneyMap() {
  const { setSplitPanel, setHelpPanel, setSplitPanelOpen } = useAppLayout();

  useEffect(() => {
    setSplitPanel({
      ...splitPanelConfig,
      header: "Customer Journey Map Details",
      children: "This is the content for Customer Journey Map",
    });
    setSplitPanelOpen(true);


    setHelpPanel({
      ...helpPanelConfig,
      header: "Customer Journey Map Help",
      children: "This is the help content for Customer Journey Map",
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
          Customer Journey Map
        </Header>
      }
    >
      <Container
        header={
          <Header variant="h2" description="Customer Journey Map description">
            Overview
          </Header>
        }
      >
        <div>Customer Journey Map content goes here</div>
      </Container>
    </ContentLayout>
  );
}
