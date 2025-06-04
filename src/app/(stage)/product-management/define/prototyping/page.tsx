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
  DatePicker,
  Input,
} from "@cloudscape-design/components";
import { useAppLayout } from "@/app/context/AppLayoutContext";
import { useRouter } from "next/navigation";

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

const prototypeTypeOptions = [
  { value: "paper", label: "Paper Prototype" },
  { value: "figma", label: "Figma Prototype" },
  { value: "spike", label: "Spike Solution" },
  { value: "code", label: "Code Prototype" },
  { value: "other", label: "Other" },
];

const statusOptions = [
  { value: "planned", label: "Planned" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

const defaultHypotheses: Hypothesis[] = [
  {
    id: "hyp1",
    objectiveId: "obj1",
    keyResultId: "kr1",
    statement: "Adding a progress bar will increase user completion rate",
    assumption: "Users need visual feedback to stay motivated",
    evidence: "70% of users drop off at step 3 without progress indication",
    confidence: "high",
    status: "draft",
  },
  {
    id: "hyp2",
    objectiveId: "obj2",
    keyResultId: "kr3",
    statement: "Implementing a guided onboarding flow will improve retention",
    assumption: "Users need clear guidance to understand core features",
    evidence: "New users spend less than 2 minutes exploring features",
    confidence: "medium",
    status: "draft",
  },
];

export default function Prototyping() {
  const { setSplitPanel, setHelpPanel, setSplitPanelOpen } = useAppLayout();
  const router = useRouter();

  const [hypotheses] = useState<Hypothesis[]>(defaultHypotheses);
  const [selectedHypothesis, setSelectedHypothesis] = useState<string>("");
  const [prototypes, setPrototypes] = useState<Prototype[]>([]);
  const [currentPrototype, setCurrentPrototype] = useState<Prototype>({
    id: "",
    hypothesisId: "",
    type: "paper",
    description: "",
    owner: "",
    startDate: "",
    endDate: "",
    successCriteria: [],
    status: "planned",
    notes: "",
  });
  const [currentCriterion, setCurrentCriterion] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showReview, setShowReview] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const updateSplitPanel = useCallback(
    (reviewing: boolean) => {
      if (reviewing && prototypes.length > 0) {
        setSplitPanel({
          header: "Prototype Analysis",
          children: (
            <SpaceBetween size="m">
              <Alert type="info" header="Prototype Analysis Complete">
                Your prototypes have been analyzed.
              </Alert>

              <Box variant="h4">Prototype Analysis</Box>
              <SpaceBetween size="xs">
                {prototypes.map((prototype, index) => (
                  <Box key={prototype.id}>
                    <Badge
                      color={
                        prototype.status === "completed"
                          ? "green"
                          : prototype.status === "in_progress"
                          ? "blue"
                          : prototype.status === "planned"
                          ? "grey"
                          : "red"
                      }
                    >
                      Prototype {index + 1}
                    </Badge>{" "}
                    {prototype.successCriteria.length > 0 ? (
                      <StatusIndicator type="success">
                        {prototype.successCriteria.length} Success Criteria
                      </StatusIndicator>
                    ) : (
                      <Box
                        variant="span"
                        color="text-status-error"
                        fontWeight="bold"
                      >
                        No Success Criteria
                      </Box>
                    )}
                  </Box>
                ))}
              </SpaceBetween>

              <Box variant="h4">Improvement Suggestions</Box>
              <Box variant="p">
                <Box variant="span" color="text-status-error" fontWeight="bold">
                  Add specific success criteria for each prototype.
                </Box>
              </Box>

              <Box variant="h4">Recommendations</Box>
              <SpaceBetween size="xs">
                <Box>• Set clear timelines</Box>
                <Box>• Define measurable success criteria</Box>
                <Box>• Assign clear ownership</Box>
              </SpaceBetween>
            </SpaceBetween>
          ),
        });
      } else {
        setSplitPanel({
          header: "Prototyping Guide",
          children: (
            <SpaceBetween size="m">
              <Box variant="h4">Effective Prototyping</Box>
              <Box variant="p">
                Choose the right prototype type based on your hypothesis and
                goals.
              </Box>
              <Box variant="h4">Prototype Types</Box>
              <Box variant="p">
                • Paper: Quick sketches for early feedback
                <br />
                • Figma: Interactive UI prototypes
                <br />
                • Spike: Technical feasibility tests
                <br />
                • Code: Functional prototypes
                <br />• Other: Custom solutions
              </Box>
            </SpaceBetween>
          ),
        });
      }
    },
    [setSplitPanel, prototypes]
  );

  useEffect(() => {
    setSplitPanelOpen(false);
    updateSplitPanel(isReviewing);

    setHelpPanel({
      header: "Prototyping Help",
      children: (
        <SpaceBetween size="m">
          <Box variant="p">
            Create prototypes to test your hypotheses and validate assumptions.
          </Box>
          <Box variant="h4">Prototype Components</Box>
          <Box variant="p">
            • Type: Choose appropriate prototype method
            <br />
            • Timeline: Set start and end dates
            <br />
            • Owner: Assign responsibility
            <br />
            • Success Criteria: Define measurable outcomes
            <br />• Status: Track progress
          </Box>
          <Box variant="h4">Example</Box>
          <Box variant="p">
            Type: Figma Prototype
            <br />
            Timeline: 2 weeks
            <br />
            Owner: UX Designer
            <br />
            Success Criteria:
            <br />
            • 80% of users complete the flow
            <br />
            • Average completion time under 2 minutes
            <br />• No critical usability issues
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
    prototypes,
    updateSplitPanel,
  ]);

  const validatePrototype = () => {
    const newErrors: Record<string, string> = {};

    if (!selectedHypothesis) {
      newErrors.hypothesis = "Select a hypothesis";
    }
    if (!currentPrototype.description.trim()) {
      newErrors.description = "Enter prototype description";
    }
    if (!currentPrototype.owner.trim()) {
      newErrors.owner = "Enter owner name";
    }
    if (!currentPrototype.startDate) {
      newErrors.startDate = "Select start date";
    }
    if (!currentPrototype.endDate) {
      newErrors.endDate = "Select end date";
    }
    if (currentPrototype.successCriteria.length === 0) {
      newErrors.successCriteria = "Add at least one success criterion";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const addSuccessCriterion = () => {
    if (currentCriterion.trim()) {
      setCurrentPrototype({
        ...currentPrototype,
        successCriteria: [
          ...currentPrototype.successCriteria,
          currentCriterion,
        ],
      });
      setCurrentCriterion("");
    }
  };

  const removeSuccessCriterion = (index: number) => {
    setCurrentPrototype({
      ...currentPrototype,
      successCriteria: currentPrototype.successCriteria.filter(
        (_, i) => i !== index
      ),
    });
  };

  const addPrototype = () => {
    if (validatePrototype()) {
      const newPrototype = {
        ...currentPrototype,
        id: Date.now().toString(),
        hypothesisId: selectedHypothesis,
      };
      setPrototypes([...prototypes, newPrototype]);
      setCurrentPrototype({
        id: "",
        hypothesisId: "",
        type: "paper",
        description: "",
        owner: "",
        startDate: "",
        endDate: "",
        successCriteria: [],
        status: "planned",
        notes: "",
      });
      setSelectedHypothesis("");
      setIsAdding(false);
      setErrors({});
    }
  };

  const removePrototype = (id: string) => {
    setPrototypes(prototypes.filter((p) => p.id !== id));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (prototypes.length === 0) {
      newErrors.prototypes = "Add at least one prototype";
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

  return (
    <ContentLayout
      header={
        <Header
          variant="h1"
          description="Create prototypes to test your hypotheses and validate assumptions"
        >
          Prototyping
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
            Prototypes have been defined. You can proceed to the next step.
          </Alert>
        )}

        <Container
          header={
            <Header
              variant="h2"
              description="Create prototypes based on your hypotheses"
              actions={
                !isAdding && (
                  <Button iconName="add-plus" onClick={() => setIsAdding(true)}>
                    Add Prototype
                  </Button>
                )
              }
            >
              Prototypes
            </Header>
          }
        >
          {errors.prototypes && <Alert type="error">{errors.prototypes}</Alert>}

          {isAdding && (
            <Container>
              <SpaceBetween size="l">
                <ColumnLayout columns={2}>
                  <FormField label="Hypothesis" errorText={errors.hypothesis}>
                    <Select
                      selectedOption={
                        selectedHypothesis
                          ? {
                              label:
                                hypotheses.find(
                                  (h) => h.id === selectedHypothesis
                                )?.statement || "",
                              value: selectedHypothesis,
                            }
                          : null
                      }
                      onChange={({ detail }) => {
                        if (detail.selectedOption.value) {
                          setSelectedHypothesis(detail.selectedOption.value);
                          setErrors({ ...errors, hypothesis: "" });
                        }
                      }}
                      options={hypotheses.map((h) => ({
                        label: h.statement,
                        value: h.id,
                      }))}
                      placeholder="Select a hypothesis"
                    />
                  </FormField>

                  <FormField label="Prototype Type">
                    <RadioGroup
                      onChange={({ detail }) =>
                        setCurrentPrototype({
                          ...currentPrototype,
                          type: detail.value as
                            | "paper"
                            | "figma"
                            | "spike"
                            | "code"
                            | "other",
                        })
                      }
                      value={currentPrototype.type}
                      items={prototypeTypeOptions}
                    />
                  </FormField>

                  <FormField label="Description" errorText={errors.description}>
                    <Textarea
                      value={currentPrototype.description}
                      onChange={({ detail }) =>
                        setCurrentPrototype({
                          ...currentPrototype,
                          description: detail.value,
                        })
                      }
                      placeholder="Describe your prototype approach"
                      rows={3}
                    />
                  </FormField>

                  <FormField label="Owner" errorText={errors.owner}>
                    <Input
                      value={currentPrototype.owner}
                      onChange={({ detail }) =>
                        setCurrentPrototype({
                          ...currentPrototype,
                          owner: detail.value,
                        })
                      }
                      placeholder="Enter owner name"
                    />
                  </FormField>

                  <FormField label="Start Date" errorText={errors.startDate}>
                    <DatePicker
                      value={currentPrototype.startDate}
                      onChange={({ detail }) =>
                        setCurrentPrototype({
                          ...currentPrototype,
                          startDate: detail.value,
                        })
                      }
                      placeholder="YYYY/MM/DD"
                    />
                  </FormField>

                  <FormField label="End Date" errorText={errors.endDate}>
                    <DatePicker
                      value={currentPrototype.endDate}
                      onChange={({ detail }) =>
                        setCurrentPrototype({
                          ...currentPrototype,
                          endDate: detail.value,
                        })
                      }
                      placeholder="YYYY/MM/DD"
                    />
                  </FormField>

                  <FormField
                    label="Success Criteria"
                    errorText={errors.successCriteria}
                  >
                    <SpaceBetween size="s">
                      <SpaceBetween size="xs" direction="horizontal">
                        <Input
                          value={currentCriterion}
                          onChange={({ detail }) =>
                            setCurrentCriterion(detail.value)
                          }
                          placeholder="Enter success criterion"
                        />
                        <Button onClick={addSuccessCriterion}>Add</Button>
                      </SpaceBetween>
                      {currentPrototype.successCriteria.map(
                        (criterion, index) => (
                          <Box key={index}>
                            • {criterion}{" "}
                            <Button
                              iconName="close"
                              variant="icon"
                              onClick={() => removeSuccessCriterion(index)}
                              ariaLabel="Remove"
                            />
                          </Box>
                        )
                      )}
                    </SpaceBetween>
                  </FormField>

                  <FormField label="Status">
                    <RadioGroup
                      onChange={({ detail }) =>
                        setCurrentPrototype({
                          ...currentPrototype,
                          status: detail.value as
                            | "planned"
                            | "in_progress"
                            | "completed"
                            | "cancelled",
                        })
                      }
                      value={currentPrototype.status}
                      items={statusOptions}
                    />
                  </FormField>

                  <FormField label="Notes">
                    <Textarea
                      value={currentPrototype.notes}
                      onChange={({ detail }) =>
                        setCurrentPrototype({
                          ...currentPrototype,
                          notes: detail.value,
                        })
                      }
                      placeholder="Additional notes or comments"
                      rows={3}
                    />
                  </FormField>
                </ColumnLayout>

                <SpaceBetween size="xs" direction="horizontal">
                  <Button onClick={() => setIsAdding(false)}>Cancel</Button>
                  <Button variant="primary" onClick={addPrototype}>
                    Add
                  </Button>
                </SpaceBetween>
              </SpaceBetween>
            </Container>
          )}

          {prototypes.length > 0 && (
            <Table
              columnDefinitions={[
                {
                  id: "hypothesis",
                  header: "Hypothesis",
                  cell: (item) =>
                    hypotheses.find((h) => h.id === item.hypothesisId)
                      ?.statement,
                },
                {
                  id: "type",
                  header: "Type",
                  cell: (item) => (
                    <Badge
                      color={
                        item.type === "figma"
                          ? "blue"
                          : item.type === "paper"
                          ? "grey"
                          : item.type === "spike"
                          ? "green"
                          : "red"
                      }
                    >
                      {item.type}
                    </Badge>
                  ),
                },
                {
                  id: "description",
                  header: "Description",
                  cell: (item) => (
                    <SpaceBetween size="xs">
                      <div>{item.description}</div>
                      <div style={{ fontSize: "14px", color: "#5f6b7a" }}>
                        Owner: {item.owner}
                      </div>
                    </SpaceBetween>
                  ),
                },
                {
                  id: "timeline",
                  header: "Timeline",
                  cell: (item) => (
                    <SpaceBetween size="xs">
                      <div>Start: {item.startDate}</div>
                      <div>End: {item.endDate}</div>
                    </SpaceBetween>
                  ),
                },
                {
                  id: "successCriteria",
                  header: "Success Criteria",
                  cell: (item) => (
                    <SpaceBetween size="xs">
                      {item.successCriteria.map((criterion, index) => (
                        <div key={index}>• {criterion}</div>
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
                        item.status === "completed"
                          ? "green"
                          : item.status === "in_progress"
                          ? "blue"
                          : item.status === "planned"
                          ? "grey"
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
                      onClick={() => removePrototype(item.id)}
                      ariaLabel="Remove"
                    />
                  ),
                },
              ]}
              items={prototypes}
              loadingText="Loading prototypes"
              empty={
                <Box textAlign="center" color="inherit">
                  <Box padding={{ bottom: "s" }} variant="p" color="inherit">
                    No prototypes defined
                  </Box>
                </Box>
              }
            />
          )}
        </Container>

        {showReview && (
          <Container header={<Header variant="h2">Prototype Review</Header>}>
            <SpaceBetween size="m">
              <Box variant="h4">Prototypes ({prototypes.length})</Box>
              <SpaceBetween size="s">
                {prototypes.map((prototype, index) => (
                  <Box key={prototype.id} padding={{ vertical: "xs" }}>
                    <Box variant="awsui-key-label">Prototype {index + 1}</Box>
                    <Box>{prototype.description}</Box>
                    <Grid
                      gridDefinition={[
                        { colspan: 3 },
                        { colspan: 3 },
                        { colspan: 3 },
                        { colspan: 3 },
                      ]}
                    >
                      <Box fontSize="body-s">
                        <Box color="text-body-secondary">Type</Box>
                        <Badge
                          color={
                            prototype.type === "figma"
                              ? "blue"
                              : prototype.type === "paper"
                              ? "grey"
                              : prototype.type === "spike"
                              ? "green"
                              : "red"
                          }
                        >
                          {prototype.type}
                        </Badge>
                      </Box>
                      <Box fontSize="body-s">
                        <Box color="text-body-secondary">Owner</Box>
                        {prototype.owner}
                      </Box>
                      <Box fontSize="body-s">
                        <Box color="text-body-secondary">Timeline</Box>
                        {prototype.startDate} - {prototype.endDate}
                      </Box>
                      <Box fontSize="body-s">
                        <Box color="text-body-secondary">Status</Box>
                        <Badge
                          color={
                            prototype.status === "completed"
                              ? "green"
                              : prototype.status === "in_progress"
                              ? "blue"
                              : prototype.status === "planned"
                              ? "grey"
                              : "red"
                          }
                        >
                          {prototype.status}
                        </Badge>
                      </Box>
                    </Grid>
                    <Box variant="h4" padding={{ top: "s" }}>
                      Success Criteria
                    </Box>
                    <SpaceBetween size="s">
                      {prototype.successCriteria.map((criterion, index) => (
                        <Box key={index}>• {criterion}</Box>
                      ))}
                    </SpaceBetween>
                    {prototype.notes && (
                      <>
                        <Box variant="h4" padding={{ top: "s" }}>
                          Notes
                        </Box>
                        <Box>{prototype.notes}</Box>
                      </>
                    )}
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
