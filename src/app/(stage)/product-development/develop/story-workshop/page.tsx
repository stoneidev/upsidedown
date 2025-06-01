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

export default function StoryWorkshop() {
  const { setSplitPanel, setHelpPanel } = useAppLayout();

  useEffect(() => {
    setSplitPanel({
      ...splitPanelConfig,
      header: "Story Workshop Details",
      children: "This is the content for Story Workshop",
    });

    setHelpPanel({
      ...helpPanelConfig,
      header: "Story Workshop Help",
      children: "This is the help content for Story Workshop",
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
          Story Workshop
        </Header>
      }
    >
      <Container
        header={
          <Header variant="h2" description="Story Workshop description">
            Overview
          </Header>
        }
      >
        <div>Story Workshop content goes here</div>
      </Container>
    </ContentLayout>
  );
}
