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
  Input,
  DatePicker,
} from "@cloudscape-design/components";
import { useAppLayout } from "@/app/context/AppLayoutContext";
import { useRouter } from "next/navigation";

interface Prototype {
  id: string;
  hypothesisId: string;
  type: "paper" | "figma" | "spike" | "code" | "other";
  description: string;
  owner: string;
  startDate: string;
  endDate: string;
  successCriteria: string[];
  status: "planned" | "in_progress" | "completed" | "cancelled";
  notes: string;
}

interface Measurement {
  id: string;
  prototypeId: string;
  date: string;
  result: "success" | "partial" | "failure";
  metrics: {
    criterion: string;
    target: string;
    actual: string;
    achieved: boolean;
  }[];
  learnings: string;
  nextSteps: string;
  status: "draft" | "reviewed" | "approved";
}

const resultOptions = [
  { value: "success", label: "Success - All criteria met" },
  { value: "partial", label: "Partial - Some criteria met" },
  { value: "failure", label: "Failure - No criteria met" },
];

const statusOptions = [
  { value: "draft", label: "Draft" },
  { value: "reviewed", label: "Reviewed" },
  { value: "approved", label: "Approved" },
];

const defaultPrototypes: Prototype[] = [
  {
    id: "proto1",
    hypothesisId: "hyp1",
    type: "figma",
    description: "Progress bar implementation for user flow",
    owner: "UX Designer",
    startDate: "2024-03-01",
    endDate: "2024-03-15",
    successCriteria: [
      "80% of users complete the flow",
      "Average completion time under 2 minutes",
      "No critical usability issues",
    ],
    status: "completed",
    notes: "Initial prototype ready for testing",
  },
  {
    id: "proto2",
    hypothesisId: "hyp2",
    type: "code",
    description: "Guided onboarding flow implementation",
    owner: "Frontend Developer",
    startDate: "2024-03-10",
    endDate: "2024-03-25",
    successCriteria: [
      "90% of new users complete onboarding",
      "User satisfaction score above 4.5/5",
      "Support tickets reduced by 30%",
    ],
    status: "completed",
    notes: "Technical implementation complete",
  },
];

export default function Measure() {
  const { setSplitPanel, setHelpPanel, setSplitPanelOpen } = useAppLayout();
  const router = useRouter();

  const [prototypes] = useState<Prototype[]>(defaultPrototypes);
  const [selectedPrototype, setSelectedPrototype] = useState<string>("");
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [currentMeasurement, setCurrentMeasurement] = useState<Measurement>({
    id: "",
    prototypeId: "",
    date: "",
    result: "success",
    metrics: [],
    learnings: "",
    nextSteps: "",
    status: "draft",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showReview, setShowReview] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const updateSplitPanel = useCallback(
    (reviewing: boolean) => {
      if (reviewing && measurements.length > 0) {
        setSplitPanel({
          header: "Measurement Analysis",
          children: (
            <SpaceBetween size="m">
              <Alert type="info" header="Measurement Analysis Complete">
                Your prototype measurements have been analyzed.
              </Alert>

              <Box variant="h4">Measurement Analysis</Box>
              <SpaceBetween size="xs">
                {measurements.map((measurement, index) => (
                  <Box key={measurement.id}>
                    <Badge
                      color={
                        measurement.result === "success"
                          ? "green"
                          : measurement.result === "partial"
                          ? "blue"
                          : "red"
                      }
                    >
                      Measurement {index + 1}
                    </Badge>{" "}
                    {measurement.metrics.every((m) => m.achieved) ? (
                      <StatusIndicator type="success">
                        All criteria met
                      </StatusIndicator>
                    ) : (
                      <Box
                        variant="span"
                        color="text-status-error"
                        fontWeight="bold"
                      >
                        Some criteria not met
                      </Box>
                    )}
                  </Box>
                ))}
              </SpaceBetween>

              <Box variant="h4">Key Learnings</Box>
              <SpaceBetween size="xs">
                {measurements.map((measurement) => (
                  <Box key={measurement.id}>
                    <Box variant="awsui-key-label">
                      {prototypes.find((p) => p.id === measurement.prototypeId)
                        ?.description || ""}
                    </Box>
                    <Box>{measurement.learnings}</Box>
                  </Box>
                ))}
              </SpaceBetween>

              <Box variant="h4">Next Steps</Box>
              <SpaceBetween size="xs">
                {measurements.map((measurement) => (
                  <Box key={measurement.id}>
                    <Box variant="awsui-key-label">
                      {prototypes.find((p) => p.id === measurement.prototypeId)
                        ?.description || ""}
                    </Box>
                    <Box>{measurement.nextSteps}</Box>
                  </Box>
                ))}
              </SpaceBetween>
            </SpaceBetween>
          ),
        });
      } else {
        setSplitPanel({
          header: "Measurement Guide",
          children: (
            <SpaceBetween size="m">
              <Box variant="h4">Effective Measurement</Box>
              <Box variant="p">
                Track and analyze your prototype results to validate hypotheses.
              </Box>
              <Box variant="h4">Measurement Components</Box>
              <Box variant="p">
                • Result: Overall success/failure
                <br />
                • Metrics: Specific criteria measurements
                <br />
                • Learnings: Key insights
                <br />• Next Steps: Future actions
              </Box>
            </SpaceBetween>
          ),
        });
      }
    },
    [setSplitPanel, measurements, prototypes]
  );

  useEffect(() => {
    setSplitPanelOpen(false);
    updateSplitPanel(isReviewing);

    setHelpPanel({
      header: "Measurement Help",
      children: (
        <SpaceBetween size="m">
          <Box variant="p">
            Measure and analyze your prototype results to validate hypotheses.
          </Box>
          <Box variant="h4">Measurement Components</Box>
          <Box variant="p">
            • Result: Overall success/failure
            <br />
            • Metrics: Specific criteria measurements
            <br />
            • Learnings: Key insights
            <br />• Next Steps: Future actions
          </Box>
          <Box variant="h4">Example</Box>
          <Box variant="p">
            Result: Success
            <br />
            Metrics:
            <br />
            • 85% of users completed the flow
            <br />
            • Average time: 1.5 minutes
            <br />
            • No critical issues found
            <br />
            Learnings: Users prefer visual feedback
            <br />
            Next Steps: Implement in production
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
    measurements,
    updateSplitPanel,
  ]);

  const validateMeasurement = () => {
    const newErrors: Record<string, string> = {};

    if (!selectedPrototype) {
      newErrors.prototype = "Select a prototype";
    }
    if (!currentMeasurement.date) {
      newErrors.date = "Select measurement date";
    }
    if (currentMeasurement.metrics.length === 0) {
      newErrors.metrics = "Add at least one metric";
    }
    if (!currentMeasurement.learnings.trim()) {
      newErrors.learnings = "Enter key learnings";
    }
    if (!currentMeasurement.nextSteps.trim()) {
      newErrors.nextSteps = "Enter next steps";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updateMetric = (
    index: number,
    field: "target" | "actual" | "achieved",
    value: string | boolean
  ) => {
    const newMetrics = [...currentMeasurement.metrics];
    newMetrics[index] = {
      ...newMetrics[index],
      [field]: value,
    };
    setCurrentMeasurement({
      ...currentMeasurement,
      metrics: newMetrics,
    });
  };

  const addMeasurement = () => {
    if (validateMeasurement()) {
      const newMeasurement = {
        ...currentMeasurement,
        id: Date.now().toString(),
        prototypeId: selectedPrototype,
      };
      setMeasurements([...measurements, newMeasurement]);
      setCurrentMeasurement({
        id: "",
        prototypeId: "",
        date: "",
        result: "success",
        metrics: [],
        learnings: "",
        nextSteps: "",
        status: "draft",
      });
      setSelectedPrototype("");
      setIsAdding(false);
      setErrors({});
    }
  };

  const removeMeasurement = (id: string) => {
    setMeasurements(measurements.filter((m) => m.id !== id));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (measurements.length === 0) {
      newErrors.measurements = "Add at least one measurement";
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
      router.push("/product-management/validate/learn");
    }
  };

  return (
    <ContentLayout
      header={
        <Header
          variant="h1"
          description="Measure and analyze your prototype results to validate hypotheses"
        >
          Measure
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
            Measurements have been defined. You can proceed to the next step.
          </Alert>
        )}

        <Container
          header={
            <Header
              variant="h2"
              description="Track and analyze prototype results"
              actions={
                !isAdding && (
                  <Button iconName="add-plus" onClick={() => setIsAdding(true)}>
                    Add Measurement
                  </Button>
                )
              }
            >
              Measurements
            </Header>
          }
        >
          {errors.measurements && (
            <Alert type="error">{errors.measurements}</Alert>
          )}

          {isAdding && (
            <Container>
              <SpaceBetween size="l">
                <ColumnLayout columns={2}>
                  <FormField label="Prototype" errorText={errors.prototype}>
                    <Select
                      selectedOption={
                        selectedPrototype
                          ? {
                              label:
                                prototypes.find(
                                  (p) => p.id === selectedPrototype
                                )?.description || "",
                              value: selectedPrototype,
                            }
                          : null
                      }
                      onChange={({ detail }) => {
                        if (detail.selectedOption.value) {
                          setSelectedPrototype(detail.selectedOption.value);
                          setErrors({ ...errors, prototype: "" });
                          const prototype = prototypes.find(
                            (p) => p.id === detail.selectedOption.value
                          );
                          if (prototype) {
                            const newMetrics = prototype.successCriteria.map(
                              (criterion) => ({
                                criterion,
                                target: "",
                                actual: "",
                                achieved: false,
                              })
                            );
                            setCurrentMeasurement({
                              id: "",
                              prototypeId: prototype.id,
                              date: "",
                              result: "success",
                              metrics: newMetrics,
                              learnings: "",
                              nextSteps: "",
                              status: "draft",
                            });
                          }
                        }
                      }}
                      options={prototypes.map((p) => ({
                        label: p.description,
                        value: p.id,
                      }))}
                      placeholder="Select a prototype"
                    />
                  </FormField>

                  <FormField label="Date" errorText={errors.date}>
                    <DatePicker
                      value={currentMeasurement.date}
                      onChange={({ detail }) =>
                        setCurrentMeasurement({
                          ...currentMeasurement,
                          date: detail.value,
                        })
                      }
                      placeholder="YYYY/MM/DD"
                    />
                  </FormField>

                  <FormField label="Result">
                    <RadioGroup
                      onChange={({ detail }) =>
                        setCurrentMeasurement({
                          ...currentMeasurement,
                          result: detail.value as
                            | "success"
                            | "partial"
                            | "failure",
                        })
                      }
                      value={currentMeasurement.result}
                      items={resultOptions}
                    />
                  </FormField>

                  <FormField label="Status">
                    <RadioGroup
                      onChange={({ detail }) =>
                        setCurrentMeasurement({
                          ...currentMeasurement,
                          status: detail.value as
                            | "draft"
                            | "reviewed"
                            | "approved",
                        })
                      }
                      value={currentMeasurement.status}
                      items={statusOptions}
                    />
                  </FormField>

                  <FormField
                    label="Metrics"
                    errorText={errors.metrics}
                    description="Enter target and actual values for each success criterion"
                  >
                    <SpaceBetween size="m">
                      {currentMeasurement.metrics.map((metric, index) => (
                        <Box key={index} padding={{ vertical: "xs" }}>
                          <Box variant="awsui-key-label">
                            {metric.criterion}
                          </Box>
                          <Grid
                            gridDefinition={[
                              { colspan: 4 },
                              { colspan: 4 },
                              { colspan: 4 },
                            ]}
                          >
                            <FormField label="Target">
                              <Input
                                value={metric.target}
                                onChange={({ detail }) =>
                                  updateMetric(index, "target", detail.value)
                                }
                                placeholder="Enter target value"
                              />
                            </FormField>
                            <FormField label="Actual">
                              <Input
                                value={metric.actual}
                                onChange={({ detail }) =>
                                  updateMetric(index, "actual", detail.value)
                                }
                                placeholder="Enter actual value"
                              />
                            </FormField>
                            <FormField label="Achieved">
                              <RadioGroup
                                onChange={({ detail }) =>
                                  updateMetric(
                                    index,
                                    "achieved",
                                    detail.value === "true"
                                  )
                                }
                                value={metric.achieved.toString()}
                                items={[
                                  { value: "true", label: "Yes" },
                                  { value: "false", label: "No" },
                                ]}
                              />
                            </FormField>
                          </Grid>
                        </Box>
                      ))}
                    </SpaceBetween>
                  </FormField>

                  <FormField label="Key Learnings" errorText={errors.learnings}>
                    <Textarea
                      value={currentMeasurement.learnings}
                      onChange={({ detail }) =>
                        setCurrentMeasurement({
                          ...currentMeasurement,
                          learnings: detail.value,
                        })
                      }
                      placeholder="Enter key learnings from the prototype"
                      rows={3}
                    />
                  </FormField>

                  <FormField label="Next Steps" errorText={errors.nextSteps}>
                    <Textarea
                      value={currentMeasurement.nextSteps}
                      onChange={({ detail }) =>
                        setCurrentMeasurement({
                          ...currentMeasurement,
                          nextSteps: detail.value,
                        })
                      }
                      placeholder="Enter next steps based on the results"
                      rows={3}
                    />
                  </FormField>
                </ColumnLayout>

                <SpaceBetween size="xs" direction="horizontal">
                  <Button onClick={() => setIsAdding(false)}>Cancel</Button>
                  <Button variant="primary" onClick={addMeasurement}>
                    Add
                  </Button>
                </SpaceBetween>
              </SpaceBetween>
            </Container>
          )}

          {measurements.length > 0 && (
            <Table
              columnDefinitions={[
                {
                  id: "prototype",
                  header: "Prototype",
                  cell: (item) =>
                    prototypes.find((p) => p.id === item.prototypeId)
                      ?.description,
                },
                {
                  id: "date",
                  header: "Date",
                  cell: (item) => item.date,
                },
                {
                  id: "result",
                  header: "Result",
                  cell: (item) => (
                    <Badge
                      color={
                        item.result === "success"
                          ? "green"
                          : item.result === "partial"
                          ? "blue"
                          : "red"
                      }
                    >
                      {item.result}
                    </Badge>
                  ),
                },
                {
                  id: "metrics",
                  header: "Metrics",
                  cell: (item) => (
                    <SpaceBetween size="xs">
                      {item.metrics.map((metric, index) => (
                        <div key={index}>
                          • {metric.criterion}: {metric.actual} /{" "}
                          {metric.target} {metric.achieved ? "✓" : "✗"}
                        </div>
                      ))}
                    </SpaceBetween>
                  ),
                },
                {
                  id: "status",
                  header: "Status",
                  cell: (item) => (
                    <Badge
                      color={
                        item.status === "approved"
                          ? "green"
                          : item.status === "reviewed"
                          ? "blue"
                          : "grey"
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
                      onClick={() => removeMeasurement(item.id)}
                      ariaLabel="Remove"
                    />
                  ),
                },
              ]}
              items={measurements}
              loadingText="Loading measurements"
              empty={
                <Box textAlign="center" color="inherit">
                  <Box padding={{ bottom: "s" }} variant="p" color="inherit">
                    No measurements defined
                  </Box>
                </Box>
              }
            />
          )}
        </Container>

        {showReview && (
          <Container header={<Header variant="h2">Measurement Review</Header>}>
            <SpaceBetween size="m">
              <Box variant="h4">Measurements ({measurements.length})</Box>
              <SpaceBetween size="s">
                {measurements.map((measurement, index) => (
                  <Box key={measurement.id} padding={{ vertical: "xs" }}>
                    <Box variant="awsui-key-label">Measurement {index + 1}</Box>
                    <Box>
                      {
                        prototypes.find((p) => p.id === measurement.prototypeId)
                          ?.description
                      }
                    </Box>
                    <Grid
                      gridDefinition={[
                        { colspan: 3 },
                        { colspan: 3 },
                        { colspan: 3 },
                        { colspan: 3 },
                      ]}
                    >
                      <Box fontSize="body-s">
                        <Box color="text-body-secondary">Date</Box>
                        {measurement.date}
                      </Box>
                      <Box fontSize="body-s">
                        <Box color="text-body-secondary">Result</Box>
                        <Badge
                          color={
                            measurement.result === "success"
                              ? "green"
                              : measurement.result === "partial"
                              ? "blue"
                              : "red"
                          }
                        >
                          {measurement.result}
                        </Badge>
                      </Box>
                      <Box fontSize="body-s">
                        <Box color="text-body-secondary">Status</Box>
                        <Badge
                          color={
                            measurement.status === "approved"
                              ? "green"
                              : measurement.status === "reviewed"
                              ? "blue"
                              : "grey"
                          }
                        >
                          {measurement.status}
                        </Badge>
                      </Box>
                      <Box fontSize="body-s">
                        <Box color="text-body-secondary">Metrics Achieved</Box>
                        {
                          measurement.metrics.filter((m) => m.achieved).length
                        } / {measurement.metrics.length}
                      </Box>
                    </Grid>
                    <Box variant="h4" padding={{ top: "s" }}>
                      Key Learnings
                    </Box>
                    <Box>{measurement.learnings}</Box>
                    <Box variant="h4" padding={{ top: "s" }}>
                      Next Steps
                    </Box>
                    <Box>{measurement.nextSteps}</Box>
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
