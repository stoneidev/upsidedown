"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  Container,
  ContentLayout,
  Header,
  Button,
  SpaceBetween,
  FormField,
  Input,
  Textarea,
  Box,
  ColumnLayout,
  Alert,
  Grid,
  StatusIndicator,
  Badge,
  RadioGroup,
  Table,
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

const impactOptions = [
  { value: "high", label: "High - Significant business impact" },
  { value: "medium", label: "Medium - Moderate impact" },
  { value: "low", label: "Low - Limited impact" },
];

const confidenceOptions = [
  { value: "high", label: "High - Strong evidence" },
  { value: "medium", label: "Medium - Some evidence" },
  { value: "low", label: "Low - Limited evidence" },
];

export default function OutcomeIdentification() {
  const { setSplitPanel, setHelpPanel, setSplitPanelOpen } = useAppLayout();
  const router = useRouter();

  const [objectives, setObjectives] = useState<Objective[]>([]);
  const [currentObjective, setCurrentObjective] = useState<Objective>({
    id: "",
    title: "",
    description: "",
    keyResults: [],
    impact: "medium",
  });
  const [currentKeyResult, setCurrentKeyResult] = useState<KeyResult>({
    id: "",
    description: "",
    metric: "",
    target: "",
    timeframe: "",
    confidence: "medium",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showReview, setShowReview] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);
  const [isAddingObjective, setIsAddingObjective] = useState(false);
  const [isAddingKeyResult, setIsAddingKeyResult] = useState(false);
  const [selectedObjectiveId, setSelectedObjectiveId] = useState<string>("");

  const updateSplitPanel = useCallback(
    (reviewing: boolean) => {
      if (reviewing && objectives.length > 0) {
        setSplitPanel({
          header: "OKR Analysis",
          children: (
            <SpaceBetween size="m">
              <Alert type="info" header="OKR Analysis Complete">
                Your OKRs have been analyzed.
              </Alert>

              <Box variant="h4">OKR Analysis</Box>
              <SpaceBetween size="xs">
                {objectives.map((objective, index) => (
                  <Box key={objective.id}>
                    <Badge
                      color={
                        objective.impact === "high"
                          ? "red"
                          : objective.impact === "medium"
                          ? "blue"
                          : "grey"
                      }
                    >
                      Objective {index + 1}
                    </Badge>{" "}
                    {objective.keyResults.length > 0 ? (
                      <StatusIndicator type="success">
                        {objective.keyResults.length} Key Results
                      </StatusIndicator>
                    ) : (
                      <Box
                        variant="span"
                        color="text-status-error"
                        fontWeight="bold"
                      >
                        No Key Results
                      </Box>
                    )}
                  </Box>
                ))}
              </SpaceBetween>

              <Box variant="h4">Improvement Suggestions</Box>
              <Box variant="p">
                <Box variant="span" color="text-status-error" fontWeight="bold">
                  Make sure each Objective has measurable Key Results.
                </Box>
              </Box>

              <Box variant="h4">Recommendations</Box>
              <SpaceBetween size="xs">
                <Box>• Focus on user behavior changes</Box>
                <Box>• Make Key Results specific and measurable</Box>
                <Box>• Consider dependencies between Objectives</Box>
              </SpaceBetween>
            </SpaceBetween>
          ),
        });
      } else {
        setSplitPanel({
          header: "OKR Writing Guide",
          children: (
            <SpaceBetween size="m">
              <Box variant="h4">Effective OKR Writing</Box>
              <Box variant="p">
                Objectives should be ambitious and Key Results should be
                measurable.
              </Box>
              <Box variant="h4">OKR Structure</Box>
              <Box variant="p">
                • Objective: What you want to achieve
                <br />
                • Key Results: How you&apos;ll measure success
                <br />
                • Focus on user behavior changes
                <br />
                • Make it specific and measurable
                <br />• Set ambitious but achievable goals
              </Box>
            </SpaceBetween>
          ),
        });
      }
    },
    [setSplitPanel, objectives]
  );

  useEffect(() => {
    setSplitPanelOpen(false);
    updateSplitPanel(isReviewing);

    setHelpPanel({
      header: "OKR Identification Help",
      children: (
        <SpaceBetween size="m">
          <Box variant="p">
            Define clear Objectives and Key Results based on user behavior
            changes.
          </Box>
          <Box variant="h4">OKR Components</Box>
          <Box variant="p">
            • Objective: Desired user behavior change
            <br />
            • Key Results: Measurable outcomes
            <br />
            • Metrics: How to measure success
            <br />
            • Targets: Specific goals
            <br />• Timeframe: When to achieve
          </Box>
          <Box variant="h4">Example</Box>
          <Box variant="p">
            Objective: Increase user engagement with core features
            <br />
            Key Results:
            <br />
            • Daily active users increase by 30%
            <br />
            • Feature usage time increase by 50%
            <br />• User retention rate improve to 70%
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
    objectives,
    updateSplitPanel,
  ]);

  const validateKeyResult = () => {
    const newErrors: Record<string, string> = {};

    if (!currentKeyResult.description.trim()) {
      newErrors.keyResultDescription = "Enter key result description";
    }
    if (!currentKeyResult.metric.trim()) {
      newErrors.keyResultMetric = "Enter measurement metric";
    }
    if (!currentKeyResult.target.trim()) {
      newErrors.keyResultTarget = "Enter target value";
    }
    if (!currentKeyResult.timeframe.trim()) {
      newErrors.keyResultTimeframe = "Enter timeframe";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateObjective = () => {
    const newErrors: Record<string, string> = {};

    if (!currentObjective.title.trim()) {
      newErrors.objectiveTitle = "Enter objective title";
    }
    if (!currentObjective.description.trim()) {
      newErrors.objectiveDescription = "Enter objective description";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const addKeyResult = () => {
    if (validateKeyResult()) {
      const newKeyResult = {
        ...currentKeyResult,
        id: Date.now().toString(),
      };
      setObjectives(
        objectives.map((obj) =>
          obj.id === selectedObjectiveId
            ? { ...obj, keyResults: [...obj.keyResults, newKeyResult] }
            : obj
        )
      );
      setCurrentKeyResult({
        id: "",
        description: "",
        metric: "",
        target: "",
        timeframe: "",
        confidence: "medium",
      });
      setIsAddingKeyResult(false);
      setErrors({});
    }
  };

  const addObjective = () => {
    if (validateObjective()) {
      const newObjective = {
        ...currentObjective,
        id: Date.now().toString(),
        keyResults: [],
      };
      setObjectives([...objectives, newObjective]);
      setCurrentObjective({
        id: "",
        title: "",
        description: "",
        keyResults: [],
        impact: "medium",
      });
      setIsAddingObjective(false);
      setErrors({});
    }
  };

  const removeObjective = (id: string) => {
    setObjectives(objectives.filter((o) => o.id !== id));
  }; // removeObjective 함수의 끝

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (objectives.length === 0) {
      newErrors.objectives = "Add at least one objective";
    }

    const hasEmptyKeyResults = objectives.some(
      (obj) => obj.keyResults.length === 0
    );
    if (hasEmptyKeyResults) {
      newErrors.keyResults = "Each objective must have at least one key result";
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
      router.push("/product-management/define/hypothesis-building-workshop");
    }
  };

  return (
    <ContentLayout
      header={
        <Header
          variant="h1"
          description="Define clear Objectives and Key Results based on user behavior changes"
        >
          OKR Identification
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
            OKRs have been defined. You can proceed to the next step.
          </Alert>
        )}

        <Container
          header={
            <Header
              variant="h2"
              description="Define objectives that focus on user behavior changes"
              actions={
                !isAddingObjective && (
                  <Button
                    iconName="add-plus"
                    onClick={() => setIsAddingObjective(true)}
                  >
                    Add Objective
                  </Button>
                )
              }
            >
              Objectives
            </Header>
          }
        >
          {errors.objectives && <Alert type="error">{errors.objectives}</Alert>}

          {isAddingObjective && (
            <Container>
              <SpaceBetween size="l">
                <ColumnLayout columns={2}>
                  <FormField
                    label="Objective Title"
                    errorText={errors.objectiveTitle}
                  >
                    <Input
                      value={currentObjective.title}
                      onChange={({ detail }) =>
                        setCurrentObjective({
                          ...currentObjective,
                          title: detail.value,
                        })
                      }
                      placeholder="e.g., Increase user engagement with core features"
                    />
                  </FormField>

                  <FormField label="Impact">
                    <RadioGroup
                      onChange={({ detail }) =>
                        setCurrentObjective({
                          ...currentObjective,
                          impact: detail.value as "high" | "medium" | "low",
                        })
                      }
                      value={currentObjective.impact}
                      items={impactOptions}
                    />
                  </FormField>

                  <FormField
                    label="Description"
                    errorText={errors.objectiveDescription}
                  >
                    <Textarea
                      value={currentObjective.description}
                      onChange={({ detail }) =>
                        setCurrentObjective({
                          ...currentObjective,
                          description: detail.value,
                        })
                      }
                      placeholder="Describe the desired user behavior change"
                      rows={3}
                    />
                  </FormField>
                </ColumnLayout>

                <SpaceBetween size="xs" direction="horizontal">
                  <Button onClick={() => setIsAddingObjective(false)}>
                    Cancel
                  </Button>
                  <Button variant="primary" onClick={addObjective}>
                    Add
                  </Button>
                </SpaceBetween>
              </SpaceBetween>
            </Container>
          )}

          {objectives.length > 0 && (
            <Table
              columnDefinitions={[
                {
                  id: "title",
                  header: "Objective",
                  cell: (item) => (
                    <SpaceBetween size="xs">
                      <div>{item.title}</div>
                      <div style={{ fontSize: "14px", color: "#5f6b7a" }}>
                        {item.description}
                      </div>
                    </SpaceBetween>
                  ),
                },
                {
                  id: "keyResults",
                  header: "Key Results",
                  cell: (item) => (
                    <SpaceBetween size="xs">
                      {item.keyResults.map((kr) => (
                        <div key={kr.id}>
                          • {kr.description} ({kr.metric}: {kr.target})
                        </div>
                      ))}
                    </SpaceBetween>
                  ),
                },
                {
                  id: "impact",
                  header: "Impact",
                  cell: (item) => (
                    <Badge
                      color={
                        item.impact === "high"
                          ? "red"
                          : item.impact === "medium"
                          ? "blue"
                          : "grey"
                      }
                    >
                      {
                        impactOptions
                          .find((opt) => opt.value === item.impact)
                          ?.label.split(" - ")[0]
                      }
                    </Badge>
                  ),
                },
                {
                  id: "actions",
                  header: "Actions",
                  cell: (item) => (
                    <SpaceBetween size="xs" direction="horizontal">
                      <Button
                        iconName="add-plus"
                        variant="icon"
                        onClick={() => {
                          setSelectedObjectiveId(item.id);
                          setIsAddingKeyResult(true);
                        }}
                        ariaLabel="Add Key Result"
                      />
                      <Button
                        iconName="close"
                        variant="icon"
                        onClick={() => removeObjective(item.id)}
                        ariaLabel="Remove"
                      />
                    </SpaceBetween>
                  ),
                },
              ]}
              items={objectives}
              loadingText="Loading objectives"
              empty={
                <Box textAlign="center" color="inherit">
                  <Box padding={{ bottom: "s" }} variant="p" color="inherit">
                    No objectives defined
                  </Box>
                </Box>
              }
            />
          )}
        </Container>

        {isAddingKeyResult && (
          <Container
            header={
              <Header
                variant="h2"
                description="Add measurable key results for the selected objective"
              >
                Add Key Result
              </Header>
            }
          >
            <SpaceBetween size="l">
              <ColumnLayout columns={2}>
                <FormField
                  label="Key Result Description"
                  errorText={errors.keyResultDescription}
                >
                  <Input
                    value={currentKeyResult.description}
                    onChange={({ detail }) =>
                      setCurrentKeyResult({
                        ...currentKeyResult,
                        description: detail.value,
                      })
                    }
                    placeholder="e.g., Increase daily active users"
                  />
                </FormField>

                <FormField label="Confidence">
                  <RadioGroup
                    onChange={({ detail }) =>
                      setCurrentKeyResult({
                        ...currentKeyResult,
                        confidence: detail.value as "high" | "medium" | "low",
                      })
                    }
                    value={currentKeyResult.confidence}
                    items={confidenceOptions}
                  />
                </FormField>

                <FormField
                  label="Measurement Metric"
                  errorText={errors.keyResultMetric}
                >
                  <Input
                    value={currentKeyResult.metric}
                    onChange={({ detail }) =>
                      setCurrentKeyResult({
                        ...currentKeyResult,
                        metric: detail.value,
                      })
                    }
                    placeholder="e.g., Daily Active Users"
                  />
                </FormField>

                <FormField
                  label="Target Value"
                  errorText={errors.keyResultTarget}
                >
                  <Input
                    value={currentKeyResult.target}
                    onChange={({ detail }) =>
                      setCurrentKeyResult({
                        ...currentKeyResult,
                        target: detail.value,
                      })
                    }
                    placeholder="e.g., 30% increase"
                  />
                </FormField>

                <FormField
                  label="Timeframe"
                  errorText={errors.keyResultTimeframe}
                >
                  <Input
                    value={currentKeyResult.timeframe}
                    onChange={({ detail }) =>
                      setCurrentKeyResult({
                        ...currentKeyResult,
                        timeframe: detail.value,
                      })
                    }
                    placeholder="e.g., Q2 2024"
                  />
                </FormField>
              </ColumnLayout>

              <SpaceBetween size="xs" direction="horizontal">
                <Button onClick={() => setIsAddingKeyResult(false)}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={addKeyResult}>
                  Add
                </Button>
              </SpaceBetween>
            </SpaceBetween>
          </Container>
        )}

        {showReview && (
          <Container header={<Header variant="h2">OKR Review</Header>}>
            <SpaceBetween size="m">
              <Box variant="h4">Objectives ({objectives.length})</Box>
              <SpaceBetween size="s">
                {objectives.map((objective, index) => (
                  <Box key={objective.id} padding={{ vertical: "xs" }}>
                    <Box variant="awsui-key-label">
                      Objective {index + 1}: {objective.title}
                    </Box>
                    <Box>{objective.description}</Box>
                    <Box variant="h4" padding={{ top: "s" }}>
                      Key Results ({objective.keyResults.length})
                    </Box>
                    <SpaceBetween size="s">
                      {objective.keyResults.map((kr) => (
                        <Box key={kr.id} padding={{ vertical: "xs" }}>
                          <Grid
                            gridDefinition={[
                              { colspan: 3 },
                              { colspan: 3 },
                              { colspan: 3 },
                              { colspan: 3 },
                            ]}
                          >
                            <Box fontSize="body-s">
                              <Box color="text-body-secondary">Description</Box>
                              {kr.description}
                            </Box>
                            <Box fontSize="body-s">
                              <Box color="text-body-secondary">Metric</Box>
                              {kr.metric}
                            </Box>
                            <Box fontSize="body-s">
                              <Box color="text-body-secondary">Target</Box>
                              {kr.target}
                            </Box>
                            <Box fontSize="body-s">
                              <Box color="text-body-secondary">Confidence</Box>
                              <Badge
                                color={
                                  kr.confidence === "high"
                                    ? "green"
                                    : kr.confidence === "medium"
                                    ? "blue"
                                    : "grey"
                                }
                              >
                                {
                                  confidenceOptions
                                    .find((opt) => opt.value === kr.confidence)
                                    ?.label.split(" - ")[0]
                                }
                              </Badge>
                            </Box>
                          </Grid>
                        </Box>
                      ))}
                    </SpaceBetween>
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
