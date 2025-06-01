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

export default function ValueStreamIdentify() {
  const { setSplitPanel, setHelpPanel } = useAppLayout();

  useEffect(() => {
    setSplitPanel({
      ...splitPanelConfig,
      header: "Value Stream Identify Details",
      children: "This is the content for Value Stream Identify",
    });

    setHelpPanel({
      ...helpPanelConfig,
      header: "Value Stream Identify Help",
      children: "This is the help content for Value Stream Identify",
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
          Value Stream Identify
        </Header>
      }
    >
      <Container
        header={
          <Header variant="h2" description="Value Stream Identify description">
            Overview
          </Header>
        }
      >
        <div>Value Stream Identify content goes here</div>
      </Container>
    </ContentLayout>
  );
}
