"use client";

import React, { useEffect, useState } from "react";
import {
  Container,
  ContentLayout,
  Header,
  Link,
  SpaceBetween,
  Button,
  Input,
  Alert,
} from "@cloudscape-design/components";
import { useAppLayout } from "@/app/context/AppLayoutContext";
import ReactMarkdown from "react-markdown";

export default function PRFAQRevision() {
  const { setSplitPanel, setHelpPanel, setSplitPanelOpen } = useAppLayout();

  // FAQ 관리
  const [faqs, setFaqs] = useState([
    {
      question: "Who can use Prime Pantry Express?",
      answer:
        "Prime Pantry Express is available exclusively to Amazon Prime members in select cities.",
    },
    {
      question: "What products are available for two-hour delivery?",
      answer:
        "A curated selection of groceries, fresh produce, dairy, snacks, beverages, and household essentials.",
    },
    {
      question: "How do I track my order?",
      answer:
        "You can track your order in real time via the Amazon app or website, from packing to delivery.",
    },
    {
      question: "Is there an extra fee for this service?",
      answer:
        "Two-hour delivery is included for free with Prime Pantry Express orders over $35. Orders below $35 incur a small delivery fee.",
    },
    {
      question: "What if an item is out of stock?",
      answer:
        "You will be notified at checkout, and suggested replacements will be offered when available.",
    },
  ]);
  const [newFaq, setNewFaq] = useState({ question: "", answer: "" });
  const [alert, setAlert] = useState<string | null>(null);

  useEffect(() => {
    setSplitPanel({
      header: "PR/FAQ Guide",
      children: (
        <div>
          This panel provides guidance for writing a Press Release and FAQ
          (PR/FAQ) in the Amazon style.
        </div>
      ),
    });
    setSplitPanelOpen(true);
    setHelpPanel({
      header: "PR/FAQ Help",
      children: (
        <div>
          <b>Tip:</b> Write the press release as if the product is already
          launched. FAQs should address real customer and stakeholder concerns.
        </div>
      ),
    });
    return () => {
      setSplitPanel(null);
      setHelpPanel(null);
      setSplitPanelOpen(false);
    };
  }, [setSplitPanel, setHelpPanel, setSplitPanelOpen]);

  // FAQ 추가/삭제
  const handleAddFaq = () => {
    if (newFaq.question.trim() && newFaq.answer.trim()) {
      setFaqs([...faqs, newFaq]);
      setNewFaq({ question: "", answer: "" });
      setAlert("FAQ added.");
      setTimeout(() => setAlert(null), 2000);
    }
  };
  const handleRemoveFaq = (idx: number) => {
    setFaqs(faqs.filter((_, i) => i !== idx));
  };

  // PR/FAQ Markdown 생성
  function generateMarkdown() {
    return (
      `# Press Release\n\n` +
      `## Headline\nAmazon Launches "Prime Pantry Express" – Groceries Delivered in Under 2 Hours\n\n` +
      `## Subheadline\nA new service for Prime members delivers everyday essentials and fresh groceries to your door in record time.\n\n` +
      `## Problem\nBusy customers struggle to find time for grocery shopping, often facing out-of-stock items and long delivery windows. Traditional online grocery services can be slow and unreliable, leading to frustration and wasted time.\n\n` +
      `## Solution\nPrime Pantry Express leverages Amazon's advanced logistics and local fulfillment centers to deliver groceries and household essentials in under two hours. Customers can shop from a curated selection of fresh produce, dairy, snacks, and cleaning supplies, all at competitive prices.\n\n` +
      `## Customer Quote\n> "With Prime Pantry Express, I can order groceries after work and have them at my door before dinner. It's a game changer for my family!"\n> — Sarah L., Seattle\n\n` +
      `## How it works\n- Prime members access the service via the Amazon app or website.\n- Customers select from thousands of everyday items, including fresh and frozen foods.\n- Orders are fulfilled from local Amazon facilities and delivered by Amazon drivers.\n- Real-time tracking and delivery updates are provided throughout the process.\n\n` +
      `## Call to Action\nPrime members can try Prime Pantry Express today in select cities. Sign up now and enjoy two-hour grocery delivery!\n\n` +
      `---\n\n` +
      `## FAQ\n${faqs
        .map((f, i) => `**Q${i + 1}. ${f.question}**\n\n${f.answer}\n`)
        .join("\n")}\n`
    );
  }

  return (
    <ContentLayout
      header={
        <Header variant="h1" info={<Link variant="info">Info</Link>}>
          PR/FAQ (Prime Pantry Express)
        </Header>
      }
    >
      <SpaceBetween size="l">
        {alert && <Alert type="success">{alert}</Alert>}
        <Container header={<Header variant="h2">FAQ</Header>}>
          <SpaceBetween size="m">
            {faqs.map((faq, idx) => (
              <div key={idx} style={{ display: "flex", alignItems: "center" }}>
                <span style={{ flex: 1 }}>
                  <b>Q{idx + 1}.</b> {faq.question}
                  <br />
                  <span style={{ color: "#555" }}>{faq.answer}</span>
                </span>
                <Button
                  iconName="close"
                  variant="icon"
                  onClick={() => handleRemoveFaq(idx)}
                />
              </div>
            ))}
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <Input
                placeholder="Question"
                value={newFaq.question}
                onChange={({ detail }) =>
                  setNewFaq({ ...newFaq, question: detail.value })
                }
              />
              <Input
                placeholder="Answer"
                value={newFaq.answer}
                onChange={({ detail }) =>
                  setNewFaq({ ...newFaq, answer: detail.value })
                }
              />
              <Button
                onClick={handleAddFaq}
                variant="primary"
                iconName="add-plus"
              >
                Add
              </Button>
            </div>
          </SpaceBetween>
        </Container>
        <Container
          header={<Header variant="h2">PR/FAQ Markdown Preview</Header>}
        >
          <ReactMarkdown>{generateMarkdown()}</ReactMarkdown>
        </Container>
      </SpaceBetween>
    </ContentLayout>
  );
}
