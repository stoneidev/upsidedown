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

export default function PRFAQRevision() {
  const { setSplitPanel, setHelpPanel, setSplitPanelOpen } = useAppLayout();

  useEffect(() => {
    setSplitPanel({
      ...splitPanelConfig,
      header: "PR/FAQ(revision) Details",
      children: "This is the content for PR/FAQ(revision)",
    });
    setSplitPanelOpen(true);


    setHelpPanel({
      ...helpPanelConfig,
      header: "PR/FAQ(revision) Help",
      children: "This is the help content for PR/FAQ(revision)",
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
          PR/FAQ(revision)
        </Header>
      }
    >
      <Container
        header={
          <Header variant="h2" description="PR/FAQ(revision) description">
            Overview
          </Header>
        }
      >
        <div>PR/FAQ(revision) content goes here</div>
      </Container>
    </ContentLayout>
  );
}
