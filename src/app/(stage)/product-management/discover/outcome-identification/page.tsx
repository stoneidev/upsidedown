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

export default function OutcomeIdentification() {
  const { setSplitPanel, setHelpPanel } = useAppLayout();

  useEffect(() => {
    setSplitPanel({
      ...splitPanelConfig,
      header: "Outcome Identification Details",
      children: "This is the content for Outcome Identification",
    });

    setHelpPanel({
      ...helpPanelConfig,
      header: "Outcome Identification Help",
      children: "This is the help content for Outcome Identification",
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
          Outcome Identification
        </Header>
      }
    >
      <Container
        header={
          <Header variant="h2" description="Outcome Identification description">
            Overview
          </Header>
        }
      >
        <div>Outcome Identification content goes here</div>
      </Container>
    </ContentLayout>
  );
}
