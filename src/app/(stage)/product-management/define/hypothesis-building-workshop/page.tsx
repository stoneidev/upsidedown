"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  Container,
  ContentLayout,
  Header,
  SpaceBetween,
  FormField,
  Textarea,
  Button,
  Select,
  Box,
  ColumnLayout,
  Alert,
  StatusIndicator,
  Badge,
  RadioGroup,
  Table,
  Grid,
} from "@cloudscape-design/components";
import { useAppLayout } from "@/app/context/AppLayoutContext";
import { useRouter } from "next/navigation";

interface KeyResult {
  id: string;
  description: string;
  metric: string;
  target: string;
  timeframe: string;
  confidence: "high" | "medium" | "low";
}

interface Objective {
  id: string;
  title: string;
  description: string;
  keyResults: KeyResult[];
  impact: "high" | "medium" | "low";
}

interface Hypothesis {
  id: string;
  objectiveId: string;
  keyResultId: string;
  statement: string;
  assumption: string;
  evidence: string;
  confidence: "high" | "medium" | "low";
  status: "draft" | "validated" | "invalidated";
}

const confidenceOptions = [
  { value: "high", label: "High - Strong evidence" },
  { value: "medium", label: "Medium - Some evidence" },
  { value: "low", label: "Low - Limited evidence" },
];

const statusOptions = [
  { value: "draft", label: "Draft" },
  { value: "validated", label: "Validated" },
  { value: "invalidated", label: "Invalidated" },
];

const defaultObjectives: Objective[] = [
  {
    id: "obj1",
    title: "Increase User Engagement",
    description: "Improve user engagement with core features",
    impact: "high",
    keyResults: [
      {
        id: "kr1",
        description: "Increase daily active users by 30%",
        metric: "Daily Active Users",
        target: "30% increase",
        timeframe: "Q2 2024",
        confidence: "high",
      },
      {
        id: "kr2",
        description: "Increase feature usage time by 50%",
        metric: "Average Session Duration",
        target: "50% increase",
        timeframe: "Q2 2024",
        confidence: "medium",
      },
    ],
  },
  {
    id: "obj2",
    title: "Improve User Retention",
    description: "Enhance user retention and reduce churn",
    impact: "high",
    keyResults: [
      {
        id: "kr3",
        description: "Improve 30-day retention rate to 70%",
        metric: "30-day Retention Rate",
        target: "70%",
        timeframe: "Q2 2024",
        confidence: "high",
      },
      {
        id: "kr4",
        description: "Reduce churn rate by 25%",
        metric: "Monthly Churn Rate",
        target: "25% reduction",
        timeframe: "Q2 2024",
        confidence: "medium",
      },
    ],
  },
  {
    id: "obj3",
    title: "Enhance User Satisfaction",
    description: "Improve overall user satisfaction and experience",
    impact: "medium",
    keyResults: [
      {
        id: "kr5",
        description: "Achieve NPS score of 40",
        metric: "Net Promoter Score",
        target: "40",
        timeframe: "Q2 2024",
        confidence: "medium",
      },
      {
        id: "kr6",
        description: "Reduce support tickets by 30%",
        metric: "Support Ticket Volume",
        target: "30% reduction",
        timeframe: "Q2 2024",
        confidence: "high",
      },
    ],
  },
];

export default function HypothesisBuildingWorkshop() {
  const { setSplitPanel, setHelpPanel, setSplitPanelOpen } = useAppLayout();
  const router = useRouter();

  const [objectives] = useState<Objective[]>(defaultObjectives);
  const [selectedObjective, setSelectedObjective] = useState<string>("");
  const [selectedKeyResult, setSelectedKeyResult] = useState<string>("");
  const [hypotheses, setHypotheses] = useState<Hypothesis[]>([]);
  const [currentHypothesis, setCurrentHypothesis] = useState<Hypothesis>({
    id: "",
    objectiveId: "",
    keyResultId: "",
    statement: "",
    assumption: "",
    evidence: "",
    confidence: "medium",
    status: "draft",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showReview, setShowReview] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const updateSplitPanel = useCallback(
    (reviewing: boolean) => {
      if (reviewing && hypotheses.length > 0) {
        setSplitPanel({
          header: "Hypothesis Analysis",
          children: (
            <SpaceBetween size="m">
              <Alert type="info" header="Hypothesis Analysis Complete">
                Your hypotheses have been analyzed.
              </Alert>

              <Box variant="h4">Hypothesis Analysis</Box>
              <SpaceBetween size="xs">
                {hypotheses.map((hypothesis, index) => (
                  <Box key={hypothesis.id}>
                    <Badge
                      color={
                        hypothesis.confidence === "high"
                          ? "green"
                          : hypothesis.confidence === "medium"
                          ? "blue"
                          : "grey"
                      }
                    >
                      Hypothesis {index + 1}
                    </Badge>{" "}
                    {hypothesis.evidence ? (
                      <StatusIndicator type="success">
                        Evidence provided
                      </StatusIndicator>
                    ) : (
                      <Box
                        variant="span"
                        color="text-status-error"
                        fontWeight="bold"
                      >
                        No evidence
                      </Box>
                    )}
                  </Box>
                ))}
              </SpaceBetween>

              <Box variant="h4">Improvement Suggestions</Box>
              <Box variant="p">
                <Box variant="span" color="text-status-error" fontWeight="bold">
                  Add more evidence to support your hypotheses.
                </Box>
              </Box>

              <Box variant="h4">Recommendations</Box>
              <SpaceBetween size="xs">
                <Box>• Test hypotheses with user research</Box>
                <Box>• Gather quantitative data</Box>
                <Box>• Consider alternative hypotheses</Box>
              </SpaceBetween>
            </SpaceBetween>
          ),
        });
      } else {
        setSplitPanel({
          header: "Hypothesis Writing Guide",
          children: (
            <SpaceBetween size="m">
              <Box variant="h4">Effective Hypothesis Writing</Box>
              <Box variant="p">
                A good hypothesis should be specific, testable, and based on
                evidence.
              </Box>
              <Box variant="h4">Hypothesis Structure</Box>
              <Box variant="p">
                • Statement: Clear prediction
                <br />
                • Assumption: Why you believe it will work
                <br />
                • Evidence: Supporting data or research
                <br />
                • Confidence: Level of certainty
                <br />• Status: Current validation state
              </Box>
            </SpaceBetween>
          ),
        });
      }
    },
    [setSplitPanel, hypotheses]
  );

  useEffect(() => {
    setSplitPanelOpen(false);
    updateSplitPanel(isReviewing);

    setHelpPanel({
      header: "Hypothesis Building Help",
      children: (
        <SpaceBetween size="m">
          <Box variant="p">
            Create testable hypotheses based on your OKRs to validate your
            assumptions.
          </Box>
          <Box variant="h4">Hypothesis Components</Box>
          <Box variant="p">
            • Statement: What you expect to happen
            <br />
            • Assumption: Why you think it will work
            <br />
            • Evidence: Data supporting your assumption
            <br />
            • Confidence: How certain you are
            <br />• Status: Current validation state
          </Box>
          <Box variant="h4">Example</Box>
          <Box variant="p">
            Statement: Adding a progress bar will increase user completion rate
            <br />
            Assumption: Users need visual feedback to stay motivated
            <br />
            Evidence: 70% of users drop off at step 3 without progress
            indication
            <br />
            Confidence: High - Based on user research
            <br />
            Status: Draft - Ready for testing
          </Box>
        </SpaceBetween>
      ),
    });

    return () => {
      setSplitPanel(null);
      setHelpPanel(null);
      setSplitPanelOpen(false);
    };
  }, [
    setSplitPanel,
    setHelpPanel,
    setSplitPanelOpen,
    isReviewing,
    hypotheses,
    updateSplitPanel,
  ]);

  const validateHypothesis = () => {
    const newErrors: Record<string, string> = {};

    if (!selectedObjective) {
      newErrors.objective = "Select an objective";
    }
    if (!selectedKeyResult) {
      newErrors.keyResult = "Select a key result";
    }
    if (!currentHypothesis.statement.trim()) {
      newErrors.statement = "Enter hypothesis statement";
    }
    if (!currentHypothesis.assumption.trim()) {
      newErrors.assumption = "Enter assumption";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const addHypothesis = () => {
    if (validateHypothesis()) {
      const newHypothesis = {
        ...currentHypothesis,
        id: Date.now().toString(),
        objectiveId: selectedObjective || "",
        keyResultId: selectedKeyResult || "",
      };
      setHypotheses([...hypotheses, newHypothesis]);
      setCurrentHypothesis({
        id: "",
        objectiveId: "",
        keyResultId: "",
        statement: "",
        assumption: "",
        evidence: "",
        confidence: "medium",
        status: "draft",
      });
      setSelectedObjective("");
      setSelectedKeyResult("");
      setIsAdding(false);
      setErrors({});
    }
  };

  const removeHypothesis = (id: string) => {
    setHypotheses(hypotheses.filter((h) => h.id !== id));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (hypotheses.length === 0) {
      newErrors.hypotheses = "Add at least one hypothesis";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleReview = () => {
    if (validate()) {
      setShowReview(true);
      setIsReviewing(true);
    }
  };

  const handleNext = () => {
    if (validate()) {
      router.push("/product-management/define/experiment-design");
    }
  };

  const handleObjectiveChange = (value: string | undefined) => {
    if (value) {
      setSelectedObjective(value);
      setSelectedKeyResult("");
      setErrors({ ...errors, objective: "" });
    }
  };

  const handleKeyResultChange = (value: string | undefined) => {
    if (value) {
      setSelectedKeyResult(value);
      setErrors({ ...errors, keyResult: "" });
    }
  };

  return (
    <ContentLayout
      header={
        <Header
          variant="h1"
          description="Create testable hypotheses based on your OKRs to validate your assumptions"
        >
          Hypothesis Building Workshop
        </Header>
      }
    >
      <SpaceBetween size="l">
        {showReview && (
          <Alert
            type="success"
            dismissible
            onDismiss={() => {
              setShowReview(false);
              setIsReviewing(false);
            }}
            header="Review Complete"
          >
            Hypotheses have been defined. You can proceed to the next step.
          </Alert>
        )}

        <Container
          header={
            <Header
              variant="h2"
              description="Create hypotheses based on your OKRs"
              actions={
                !isAdding && (
                  <Button iconName="add-plus" onClick={() => setIsAdding(true)}>
                    Add Hypothesis
                  </Button>
                )
              }
            >
              Hypotheses
            </Header>
          }
        >
          {errors.hypotheses && <Alert type="error">{errors.hypotheses}</Alert>}

          {isAdding && (
            <Container>
              <SpaceBetween size="l">
                <ColumnLayout columns={2}>
                  <FormField label="Objective" errorText={errors.objective}>
                    <Select
                      selectedOption={
                        selectedObjective
                          ? {
                              label:
                                objectives.find(
                                  (o) => o.id === selectedObjective
                                )?.title || "",
                              value: selectedObjective,
                            }
                          : null
                      }
                      onChange={({ detail }) =>
                        handleObjectiveChange(detail.selectedOption.value)
                      }
                      options={objectives.map((obj) => ({
                        label: obj.title,
                        value: obj.id,
                      }))}
                      placeholder="Select an objective"
                    />
                  </FormField>

                  <FormField label="Key Result" errorText={errors.keyResult}>
                    <Select
                      selectedOption={
                        selectedKeyResult
                          ? {
                              label:
                                objectives
                                  .find((o) => o.id === selectedObjective)
                                  ?.keyResults.find(
                                    (kr) => kr.id === selectedKeyResult
                                  )?.description || "",
                              value: selectedKeyResult,
                            }
                          : null
                      }
                      onChange={({ detail }) =>
                        handleKeyResultChange(detail.selectedOption.value)
                      }
                      options={
                        objectives
                          .find((o) => o.id === selectedObjective)
                          ?.keyResults.map((kr) => ({
                            label: kr.description,
                            value: kr.id,
                          })) || []
                      }
                      placeholder="Select a key result"
                      disabled={!selectedObjective}
                    />
                  </FormField>

                  <FormField
                    label="Hypothesis Statement"
                    errorText={errors.statement}
                  >
                    <Textarea
                      value={currentHypothesis.statement}
                      onChange={({ detail }) =>
                        setCurrentHypothesis({
                          ...currentHypothesis,
                          statement: detail.value,
                        })
                      }
                      placeholder="e.g., Adding a progress bar will increase user completion rate"
                      rows={3}
                    />
                  </FormField>

                  <FormField label="Assumption" errorText={errors.assumption}>
                    <Textarea
                      value={currentHypothesis.assumption}
                      onChange={({ detail }) =>
                        setCurrentHypothesis({
                          ...currentHypothesis,
                          assumption: detail.value,
                        })
                      }
                      placeholder="e.g., Users need visual feedback to stay motivated"
                      rows={3}
                    />
                  </FormField>

                  <FormField label="Evidence">
                    <Textarea
                      value={currentHypothesis.evidence}
                      onChange={({ detail }) =>
                        setCurrentHypothesis({
                          ...currentHypothesis,
                          evidence: detail.value,
                        })
                      }
                      placeholder="e.g., 70% of users drop off at step 3 without progress indication"
                      rows={3}
                    />
                  </FormField>

                  <ColumnLayout columns={2}>
                    <FormField label="Confidence">
                      <RadioGroup
                        onChange={({ detail }) =>
                          setCurrentHypothesis({
                            ...currentHypothesis,
                            confidence: detail.value as
                              | "high"
                              | "medium"
                              | "low",
                          })
                        }
                        value={currentHypothesis.confidence}
                        items={confidenceOptions}
                      />
                    </FormField>

                    <FormField label="Status">
                      <RadioGroup
                        onChange={({ detail }) =>
                          setCurrentHypothesis({
                            ...currentHypothesis,
                            status: detail.value as
                              | "draft"
                              | "validated"
                              | "invalidated",
                          })
                        }
                        value={currentHypothesis.status}
                        items={statusOptions}
                      />
                    </FormField>
                  </ColumnLayout>
                </ColumnLayout>

                <SpaceBetween size="xs" direction="horizontal">
                  <Button onClick={() => setIsAdding(false)}>Cancel</Button>
                  <Button variant="primary" onClick={addHypothesis}>
                    Add
                  </Button>
                </SpaceBetween>
              </SpaceBetween>
            </Container>
          )}

          {hypotheses.length > 0 && (
            <Table
              columnDefinitions={[
                {
                  id: "objective",
                  header: "Objective",
                  cell: (item) =>
                    objectives.find((o) => o.id === item.objectiveId)?.title,
                },
                {
                  id: "keyResult",
                  header: "Key Result",
                  cell: (item) =>
                    objectives
                      .find((o) => o.id === item.objectiveId)
                      ?.keyResults.find((kr) => kr.id === item.keyResultId)
                      ?.description,
                },
                {
                  id: "statement",
                  header: "Hypothesis",
                  cell: (item) => (
                    <SpaceBetween size="xs">
                      <div>{item.statement}</div>
                      <div style={{ fontSize: "14px", color: "#5f6b7a" }}>
                        Assumption: {item.assumption}
                      </div>
                    </SpaceBetween>
                  ),
                },
                {
                  id: "evidence",
                  header: "Evidence",
                  cell: (item) => item.evidence || "-",
                },
                {
                  id: "confidence",
                  header: "Confidence",
                  cell: (item) => (
                    <Badge
                      color={
                        item.confidence === "high"
                          ? "green"
                          : item.confidence === "medium"
                          ? "blue"
                          : "grey"
                      }
                    >
                      {
                        confidenceOptions
                          .find((opt) => opt.value === item.confidence)
                          ?.label.split(" - ")[0]
                      }
                    </Badge>
                  ),
                },
                {
                  id: "status",
                  header: "Status",
                  cell: (item) => (
                    <Badge
                      color={
                        item.status === "validated"
                          ? "green"
                          : item.status === "draft"
                          ? "blue"
                          : "red"
                      }
                    >
                      {item.status}
                    </Badge>
                  ),
                },
                {
                  id: "actions",
                  header: "Actions",
                  cell: (item) => (
                    <Button
                      iconName="close"
                      variant="icon"
                      onClick={() => removeHypothesis(item.id)}
                      ariaLabel="Remove"
                    />
                  ),
                },
              ]}
              items={hypotheses}
              loadingText="Loading hypotheses"
              empty={
                <Box textAlign="center" color="inherit">
                  <Box padding={{ bottom: "s" }} variant="p" color="inherit">
                    No hypotheses defined
                  </Box>
                </Box>
              }
            />
          )}
        </Container>

        {showReview && (
          <Container header={<Header variant="h2">Hypothesis Review</Header>}>
            <SpaceBetween size="m">
              <Box variant="h4">Hypotheses ({hypotheses.length})</Box>
              <SpaceBetween size="s">
                {hypotheses.map((hypothesis, index) => (
                  <Box key={hypothesis.id} padding={{ vertical: "xs" }}>
                    <Box variant="awsui-key-label">Hypothesis {index + 1}</Box>
                    <Box>{hypothesis.statement}</Box>
                    <Grid
                      gridDefinition={[
                        { colspan: 3 },
                        { colspan: 3 },
                        { colspan: 3 },
                        { colspan: 3 },
                      ]}
                    >
                      <Box fontSize="body-s">
                        <Box color="text-body-secondary">Assumption</Box>
                        {hypothesis.assumption}
                      </Box>
                      <Box fontSize="body-s">
                        <Box color="text-body-secondary">Evidence</Box>
                        {hypothesis.evidence || "-"}
                      </Box>
                      <Box fontSize="body-s">
                        <Box color="text-body-secondary">Confidence</Box>
                        <Badge
                          color={
                            hypothesis.confidence === "high"
                              ? "green"
                              : hypothesis.confidence === "medium"
                              ? "blue"
                              : "grey"
                          }
                        >
                          {
                            confidenceOptions
                              .find(
                                (opt) => opt.value === hypothesis.confidence
                              )
                              ?.label.split(" - ")[0]
                          }
                        </Badge>
                      </Box>
                      <Box fontSize="body-s">
                        <Box color="text-body-secondary">Status</Box>
                        <Badge
                          color={
                            hypothesis.status === "validated"
                              ? "green"
                              : hypothesis.status === "draft"
                              ? "blue"
                              : "red"
                          }
                        >
                          {hypothesis.status}
                        </Badge>
                      </Box>
                    </Grid>
                  </Box>
                ))}
              </SpaceBetween>
            </SpaceBetween>
          </Container>
        )}

        <SpaceBetween direction="horizontal" size="xs">
          <Button onClick={handleReview} iconAlign="right" iconName="search">
            Review
          </Button>
          <Button
            variant="primary"
            onClick={handleNext}
            iconAlign="right"
            iconName="arrow-right"
          >
            Next
          </Button>
        </SpaceBetween>
      </SpaceBetween>
    </ContentLayout>
  );
}
