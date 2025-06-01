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

export default function LRP() {
  const { setSplitPanel, setHelpPanel } = useAppLayout();

  useEffect(() => {
    setSplitPanel({
      ...splitPanelConfig,
      header: "LRP Details",
      children: "This is the content for LRP",
    });

    setHelpPanel({
      ...helpPanelConfig,
      header: "LRP Help",
      children: "This is the help content for LRP",
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
          LRP
        </Header>
      }
    >
      <Container
        header={
          <Header variant="h2" description="LRP description">
            Overview
          </Header>
        }
      >
        <div>LRP content goes here</div>
      </Container>
    </ContentLayout>
  );
}
