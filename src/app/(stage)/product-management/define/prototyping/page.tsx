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

export default function Prototyping() {
  const { setSplitPanel, setHelpPanel, setSplitPanelOpen } = useAppLayout();

  useEffect(() => {
    setSplitPanel({
      ...splitPanelConfig,
      header: "Prototyping Details",
      children: "This is the content for Prototyping",
    });
    setSplitPanelOpen(true);


    setHelpPanel({
      ...helpPanelConfig,
      header: "Prototyping Help",
      children: "This is the help content for Prototyping",
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
          Prototyping
        </Header>
      }
    >
      <Container
        header={
          <Header variant="h2" description="Prototyping description">
            Overview
          </Header>
        }
      >
        <div>Prototyping content goes here</div>
      </Container>
    </ContentLayout>
  );
}
