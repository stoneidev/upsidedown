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

export default function ServiceBlueprint() {
  const { setSplitPanel, setHelpPanel } = useAppLayout();

  useEffect(() => {
    setSplitPanel({
      ...splitPanelConfig,
      header: "Service Blueprint Details",
      children: "This is the content for Service Blueprint",
    });

    setHelpPanel({
      ...helpPanelConfig,
      header: "Service Blueprint Help",
      children: "This is the help content for Service Blueprint",
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
          Service Blueprint
        </Header>
      }
    >
      <Container
        header={
          <Header variant="h2" description="Service Blueprint description">
            Overview
          </Header>
        }
      >
        <div>Service Blueprint content goes here</div>
      </Container>
    </ContentLayout>
  );
}
