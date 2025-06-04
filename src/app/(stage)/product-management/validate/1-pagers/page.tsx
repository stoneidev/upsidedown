"use client";

import React, { useEffect, useState } from "react";
import {
  Container,
  ContentLayout,
  Header,
  Link,
  SpaceBetween,
  Button,
  Box,
  Alert,
  Input,
  Select,
} from "@cloudscape-design/components";
import { useAppLayout } from "@/app/context/AppLayoutContext";
import ReactMarkdown from "react-markdown";

export default function OnePagers() {
  const { setSplitPanel, setHelpPanel, setSplitPanelOpen } = useAppLayout();

  // 예시: 각 단계별 데이터(실제 구현 시 context나 API에서 불러와야 함)
  const [guardrails, setGuardrails] = useState<string[]>([
    "No PII stored in logs",
    "Must support mobile browsers",
  ]);
  const [newGuardrail, setNewGuardrail] = useState("");
  const [alert, setAlert] = useState<string | null>(null);

  // 예시: Outcome(OKR) 여러 개로 가정
  const outcomeOptions = [
    {
      value: "okr1",
      label: "Improve retention (30-day retention rate > 50%)",
      description:
        "Objective: Improve retention; Key Results: 30-day retention rate > 50%",
      detail:
        "Objective: Improve retention; Key Results: 30-day retention rate > 50%",
    },
    {
      value: "okr2",
      label: "Increase user engagement (DAU up 20%)",
      description:
        "Objective: Increase user engagement; Key Results: Daily active users up 20%",
      detail:
        "Objective: Increase user engagement; Key Results: Daily active users up 20%",
    },
    {
      value: "okr3",
      label: "Enhance user satisfaction (NPS > 60)",
      description:
        "Objective: Enhance user satisfaction; Key Results: NPS > 60",
      detail: "Objective: Enhance user satisfaction; Key Results: NPS > 60",
    },
  ];
  type OutcomeOption = (typeof outcomeOptions)[number];
  const [selectedOutcome, setSelectedOutcome] = useState<OutcomeOption>(
    outcomeOptions[0]
  );

  // 예시 데이터 (수정 불가, 자동 생성용)
  const customerExperienceMap = `
- Awareness: Users discover our product through digital ads and word of mouth.
- Consideration: They visit our website and explore features.
- Onboarding: New users sign up and complete the onboarding flow.
- Usage: Users interact with the core features daily.
- Support: Users seek help via chat or FAQ when needed.
- Advocacy: Satisfied users recommend the product to others.
Pain points include a confusing onboarding process and slow support response times.`;
  const customerJourneyMap = `1. Awareness → 2. Consideration → 3. Onboarding → 4. Activation → 5. Retention → 6. Advocacy

- Many users drop off during onboarding due to unclear instructions.
- Activation is achieved when users complete their first key action.
- Retention is driven by regular feature updates and personalized notifications.
- Advocacy is encouraged through referral programs and user communities.`;
  const valueStream = `- Identify user needs through surveys and interviews.
- Design solutions that address key pain points.
- Develop features iteratively with user feedback.
- Measure impact using engagement and retention metrics.
- Continuously improve based on data and user input.`;
  const hypothesis =
    "If we simplify the onboarding process, then more users will complete onboarding and become active users.";
  const measure = `- 80% of new users complete onboarding within 5 minutes
- 30-day retention rate increases to 50%
- User satisfaction score for onboarding above 4.5/5`;

  useEffect(() => {
    setSplitPanel({
      header: "PRD Guide",
      children: (
        <Box>
          This panel provides guidance for writing a Product Requirement
          Document (PRD) based on your previous work.
        </Box>
      ),
    });
    setSplitPanelOpen(true);
    setHelpPanel({
      header: "PRD Help",
      children: (
        <Box>
          <b>Tip:</b> Review and refine each section. Guardrails are critical
          implementation constraints.
        </Box>
      ),
    });
    return () => {
      setSplitPanel(null);
      setHelpPanel(null);
      setSplitPanelOpen(false);
    };
  }, [setSplitPanel, setHelpPanel, setSplitPanelOpen]);

  const handleAddGuardrail = () => {
    if (newGuardrail.trim()) {
      setGuardrails([...guardrails, newGuardrail.trim()]);
      setNewGuardrail("");
    }
  };
  const handleRemoveGuardrail = (idx: number) => {
    setGuardrails(guardrails.filter((_, i) => i !== idx));
  };
  const handleSave = () => {
    setAlert("PRD has been saved. You can now review or export it.");
    setTimeout(() => setAlert(null), 3000);
  };

  // Markdown 생성 함수
  function generateMarkdown() {
    return (
      `# Product Requirement Document (PRD)\n\n` +
      `## Business Goal\n` +
      `Our primary business goal is to increase user engagement by 20% in Q3. We aim to achieve this by improving the onboarding experience and boosting user retention. This goal aligns with our company vision of delivering value to both new and existing users.\n\n` +
      `- Focus on seamless onboarding\n- Enhance retention through personalized features\n- Drive growth by increasing daily active users\n\n` +
      `## Customer Experience Map\n` +
      `The customer experience map outlines the key stages and touchpoints a user encounters. Our users typically discover our product through digital ads or recommendations, then explore our website before signing up. The onboarding process is a critical moment, followed by daily usage and occasional support interactions.\n\n` +
      `${customerExperienceMap}\n\n` +
      `Key opportunities for improvement include clarifying onboarding steps and speeding up support response times.\n\n` +
      `## Customer Journey Map\n` +
      `The customer journey consists of several stages, from initial awareness to advocacy. Each stage presents unique challenges and opportunities to engage users.\n\n` +
      `${customerJourneyMap}\n\n` +
      `We will focus on reducing drop-off during onboarding and increasing activation rates.\n\n` +
      `## Value Stream\n` +
      `Our value stream highlights the essential activities that deliver value to users. By understanding and optimizing these activities, we ensure that our product meets user needs efficiently.\n\n` +
      `${valueStream}\n\n` +
      `Continuous improvement and user feedback are central to our approach.\n\n` +
      `## Outcome (OKR)\n` +
      `${selectedOutcome.detail}\n\n` +
      `- All teams align their work to this OKR\n- Progress is tracked weekly and shared with stakeholders\n- Success is celebrated and learnings are documented\n\n` +
      `## Hypothesis\n` +
      `We hypothesize: ${hypothesis}\n\n` +
      `This hypothesis is based on user research and data analysis. If proven true, it will have a significant impact on our engagement and retention metrics.\n\n` +
      `## Measure\n` +
      `We will measure success using the following criteria:\n\n` +
      `${measure}\n\n` +
      `- Data will be collected through analytics and user surveys\n- Results will be reviewed bi-weekly\n- Adjustments will be made as needed based on findings\n\n` +
      `## Implementation Guardrails\n` +
      `${guardrails.map((g) => `- ${g}`).join("\n")}\n\n` +
      `All implementation must adhere to these guardrails to ensure compliance, security, and quality.\n`
    );
  }

  return (
    <ContentLayout
      header={
        <Header variant="h1" info={<Link variant="info">Info</Link>}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span>Product Requirement Document (PRD)</span>
            <div style={{ minWidth: 320 }}>
              <Select
                selectedOption={selectedOutcome}
                onChange={({ detail }) => {
                  const found = outcomeOptions.find(
                    (opt) => opt.value === detail.selectedOption.value
                  );
                  if (found) setSelectedOutcome(found);
                }}
                options={outcomeOptions}
                placeholder="Select an Outcome (OKR)"
                ariaLabel="Select Outcome (OKR)"
              />
            </div>
          </div>
        </Header>
      }
    >
      <SpaceBetween size="l">
        {alert && <Alert type="success">{alert}</Alert>}

        <Container
          header={<Header variant="h2">Implementation Guardrails</Header>}
        >
          <SpaceBetween size="m">
            {guardrails.map((g, idx) => (
              <div key={idx} style={{ display: "flex", alignItems: "center" }}>
                <span style={{ flex: 1 }}>{g}</span>
                <Button
                  iconName="close"
                  variant="icon"
                  onClick={() => handleRemoveGuardrail(idx)}
                />
              </div>
            ))}
            <div style={{ display: "flex", alignItems: "center" }}>
              <Input
                value={newGuardrail}
                onChange={({ detail }) => setNewGuardrail(detail.value)}
                placeholder="Add a new guardrail"
              />
              <Button
                onClick={handleAddGuardrail}
                variant="primary"
                iconName="add-plus"
              >
                Add
              </Button>
            </div>
          </SpaceBetween>
        </Container>
        <Container header={<Header variant="h2">PRD Markdown Preview</Header>}>
          <ReactMarkdown>{generateMarkdown()}</ReactMarkdown>
        </Container>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button variant="primary" onClick={handleSave} iconName="check">
            Save PRD
          </Button>
        </div>
      </SpaceBetween>
    </ContentLayout>
  );
}
