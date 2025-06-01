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

export default function OnePagers() {
  const { setSplitPanel, setHelpPanel } = useAppLayout();

  useEffect(() => {
    setSplitPanel({
      ...splitPanelConfig,
      header: "1-Pagers Details",
      children: "This is the content for 1-Pagers",
    });

    setHelpPanel({
      ...helpPanelConfig,
      header: "1-Pagers Help",
      children: "This is the help content for 1-Pagers",
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
          1-Pagers
        </Header>
      }
    >
      <Container
        header={
          <Header variant="h2" description="1-Pagers description">
            Overview
          </Header>
        }
      >
        <div>1-Pagers content goes here</div>
      </Container>
    </ContentLayout>
  );
}
