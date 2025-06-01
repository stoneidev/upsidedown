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

export default function CustomerExperienceMap() {
  const { setSplitPanel, setHelpPanel } = useAppLayout();

  useEffect(() => {
    setSplitPanel({
      ...splitPanelConfig,
      header: "Customer Experience Map Details",
      children: "This is the content for Customer Experience Map",
    });

    setHelpPanel({
      ...helpPanelConfig,
      header: "Customer Experience Map Help",
      children: "This is the help content for Customer Experience Map",
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
          Customer Experience Map
        </Header>
      }
    >
      <Container
        header={
          <Header
            variant="h2"
            description="Customer Experience Map description"
          >
            Overview
          </Header>
        }
      >
        <div>Customer Experience Map content goes here</div>
      </Container>
    </ContentLayout>
  );
}
