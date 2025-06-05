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
  Select,
  SelectProps,
} from "@cloudscape-design/components";
import { useAppLayout } from "@/app/context/AppLayoutContext";
import { useRouter } from "next/navigation";

interface JourneyStage {
  id: string;
  stage: string;
  actions: string;
  thoughts: string;
  emotions: string;
  touchpoints: string;
  painPoints: string;
}

const emotionOptions: SelectProps.Option[] = [
  { label: "Very Satisfied 😊", value: "very-satisfied" },
  { label: "Satisfied 🙂", value: "satisfied" },
  { label: "Neutral 😐", value: "neutral" },
  { label: "Unsatisfied 😕", value: "unsatisfied" },
  { label: "Very Unsatisfied 😞", value: "very-unsatisfied" },
];

export default function CustomerExperienceMap() {
  const { setSplitPanel, setHelpPanel, setSplitPanelOpen } = useAppLayout();
  const router = useRouter();

  const [persona, setPersona] = useState("");
  const [scenario, setScenario] = useState("");
  const [journeyStages, setJourneyStages] = useState<JourneyStage[]>([
    {
      id: "1",
      stage: "",
      actions: "",
      thoughts: "",
      emotions: "",
      touchpoints: "",
      painPoints: "",
    },
  ]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showReview, setShowReview] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);

  const updateSplitPanel = useCallback(
    (reviewing: boolean) => {
      if (
        reviewing &&
        persona &&
        scenario &&
        journeyStages.some((js) => js.stage)
      ) {
        setSplitPanel({
          header: "AI Review Feedback",
          children: (
            <SpaceBetween size="m">
              <Alert
                type="info"
                header="Customer Experience Map Analysis Completed"
              >
                We have analyzed the customer experience map you created. Please
                refer to the feedback below to improve.
              </Alert>

              <Box variant="h4">Persona Analysis</Box>
              <Box variant="p">
                The persona is clearly defined.
                <StatusIndicator type="success">Good</StatusIndicator>
              </Box>

              <Box variant="h4">Customer Journey Analysis</Box>
              <Box variant="p">
                The journey consists of {journeyStages.length} stages.
                <Box variant="span" color="text-status-error" fontWeight="bold">
                  {" "}
                  Generally, 5-7 stages are appropriate.
                </Box>
              </Box>

              <Box variant="h4">Pain Point Analysis</Box>
              <SpaceBetween size="xs">
                {journeyStages
                  .filter((js) => js.painPoints)
                  .map((js, index) => (
                    <Box key={js.id}>
                      <Badge color="red">Stage {index + 1}</Badge>{" "}
                      {js.painPoints ? (
                        <StatusIndicator type="warning">
                          Improvement Opportunity Found
                        </StatusIndicator>
                      ) : (
                        <Box
                          variant="span"
                          color="text-status-error"
                          fontWeight="bold"
                        >
                          Pain Point Unfilled
                        </Box>
                      )}
                    </Box>
                  ))}
              </SpaceBetween>

              <Box variant="h4">Improvement Suggestions</Box>
              <SpaceBetween size="xs">
                <Box>
                  • Record emotional changes at each stage more concretely
                </Box>
                <Box>
                  • Analyze the correlation between touchpoints and pain points
                </Box>
                <Box>
                  • Prioritize the stage with the highest improvement
                  opportunity
                </Box>
              </SpaceBetween>
            </SpaceBetween>
          ),
        });
      } else {
        setSplitPanel({
          header: "Customer Experience Map Guide",
          children: (
            <SpaceBetween size="m">
              <Box variant="h4">Effective Customer Experience Map</Box>
              <Box variant="p">
                Visualize the entire customer journey to discover improvement
                opportunities.
              </Box>
              <Box variant="h4">Tips</Box>
              <Box variant="p">
                • Base on real customer interviews or observations
                <br />• Focus on emotional changes at each stage
                <br />• Describe pain points in detail
              </Box>
            </SpaceBetween>
          ),
        });
      }
    },
    [setSplitPanel, persona, scenario, journeyStages]
  );

  useEffect(() => {
    setSplitPanelOpen(false);
    updateSplitPanel(isReviewing);

    setHelpPanel({
      header: "Customer Experience Map",
      children: (
        <SpaceBetween size="m">
          <Box variant="p">
            Map the customer journey by stage to discover improvement
            opportunities.
          </Box>
          <Box variant="h4">Components</Box>
          <Box variant="p">
            • Stage: Key stages the customer goes through
            <br />• Action: Specific actions at each stage
            <br />• Thought: Customer&apos;s inner thoughts
            <br />• Emotion: Emotional state at each stage
            <br />• Touchpoint: Points of contact with the customer
            <br />• Pain Point: Discomforts and issues
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
    persona,
    scenario,
    journeyStages,
    updateSplitPanel,
  ]);

  const addJourneyStage = () => {
    const newId = (journeyStages.length + 1).toString();
    setJourneyStages([
      ...journeyStages,
      {
        id: newId,
        stage: "",
        actions: "",
        thoughts: "",
        emotions: "",
        touchpoints: "",
        painPoints: "",
      },
    ]);
  };

  const removeJourneyStage = (id: string) => {
    if (journeyStages.length > 1) {
      setJourneyStages(journeyStages.filter((js) => js.id !== id));
    }
  };

  const updateJourneyStage = (
    id: string,
    field: keyof JourneyStage,
    value: string
  ) => {
    setJourneyStages(
      journeyStages.map((js) => (js.id === id ? { ...js, [field]: value } : js))
    );
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!persona.trim()) {
      newErrors.persona = "Please enter the persona.";
    }

    if (!scenario.trim()) {
      newErrors.scenario = "Please enter the scenario.";
    }

    const hasEmptyStage = journeyStages.some((js) => !js.stage.trim());
    if (hasEmptyStage) {
      newErrors.journeyStages = "Please enter the name of all stages.";
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
      router.push("/product-team/map/service-blueprint");
    }
  };

  return (
    <ContentLayout
      header={
        <Header
          variant="h1"
          description="Visualize the customer journey to discover improvement opportunities"
        >
          Customer Experience Map
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
            header="Review Completed"
          >
            Customer experience map has been created. You can proceed to the
            next step.
          </Alert>
        )}

        <Container
          header={
            <Header variant="h2" description="Define the persona and scenario">
              Basic Information
            </Header>
          }
        >
          <SpaceBetween size="l">
            <FormField
              label="Persona"
              description="Define the characteristics of the representative customer in detail."
              errorText={errors.persona}
              stretch
            >
              <Input
                value={persona}
                onChange={({ detail }) => {
                  setPersona(detail.value);
                  setErrors({ ...errors, persona: "" });
                  setIsReviewing(false);
                }}
                placeholder="e.g., Mid-30s Product Manager, 5 years experience, familiar with Agile"
              />
            </FormField>

            <FormField
              label="Scenario"
              description="Describe the specific situation the customer is experiencing."
              errorText={errors.scenario}
              stretch
            >
              <Textarea
                value={scenario}
                onChange={({ detail }) => {
                  setScenario(detail.value);
                  setErrors({ ...errors, scenario: "" });
                  setIsReviewing(false);
                }}
                placeholder="e.g., Planning a new product feature and collaborating with the development team"
                rows={3}
              />
            </FormField>
          </SpaceBetween>
        </Container>

        <Container
          header={
            <Header
              variant="h2"
              description="Map each stage of the customer journey in detail"
              actions={
                <Button
                  iconName="add-plus"
                  onClick={addJourneyStage}
                  disabled={journeyStages.length >= 10}
                >
                  Add Stage
                </Button>
              }
            >
              Customer Journey Stage
            </Header>
          }
        >
          <SpaceBetween size="l">
            {journeyStages.map((js, index) => (
              <Container
                key={js.id}
                header={
                  <Header
                    variant="h3"
                    actions={
                      <Button
                        iconName="close"
                        variant="icon"
                        disabled={journeyStages.length === 1}
                        onClick={() => removeJourneyStage(js.id)}
                        ariaLabel={`Stage ${index + 1} Delete`}
                      />
                    }
                  >
                    Stage {index + 1}
                  </Header>
                }
              >
                <ColumnLayout columns={2}>
                  <FormField
                    label="Stage Name"
                    errorText={
                      errors.journeyStages && !js.stage ? "Required" : ""
                    }
                  >
                    <Input
                      value={js.stage}
                      onChange={({ detail }) => {
                        updateJourneyStage(js.id, "stage", detail.value);
                        setErrors({ ...errors, journeyStages: "" });
                        setIsReviewing(false);
                      }}
                      placeholder="e.g., Problem Recognition"
                    />
                  </FormField>

                  <FormField label="Emotion">
                    <Select
                      selectedOption={
                        emotionOptions.find(
                          (opt) => opt.value === js.emotions
                        ) || null
                      }
                      onChange={({ detail }) => {
                        updateJourneyStage(
                          js.id,
                          "emotions",
                          detail.selectedOption?.value || ""
                        );
                        setIsReviewing(false);
                      }}
                      options={emotionOptions}
                      placeholder="Select emotion"
                    />
                  </FormField>

                  <FormField label="Action">
                    <Textarea
                      value={js.actions}
                      onChange={({ detail }) => {
                        updateJourneyStage(js.id, "actions", detail.value);
                        setIsReviewing(false);
                      }}
                      placeholder="What does the customer do at this stage?"
                      rows={2}
                    />
                  </FormField>

                  <FormField label="Thought">
                    <Textarea
                      value={js.thoughts}
                      onChange={({ detail }) => {
                        updateJourneyStage(js.id, "thoughts", detail.value);
                        setIsReviewing(false);
                      }}
                      placeholder="Customer's inner thoughts"
                      rows={2}
                    />
                  </FormField>

                  <FormField label="Touchpoint">
                    <Textarea
                      value={js.touchpoints}
                      onChange={({ detail }) => {
                        updateJourneyStage(js.id, "touchpoints", detail.value);
                        setIsReviewing(false);
                      }}
                      placeholder="Points of contact (website, email, etc.)"
                      rows={2}
                    />
                  </FormField>

                  <FormField label="Pain Point">
                    <Textarea
                      value={js.painPoints}
                      onChange={({ detail }) => {
                        updateJourneyStage(js.id, "painPoints", detail.value);
                        setIsReviewing(false);
                      }}
                      placeholder="Discomforts or areas for improvement"
                      rows={2}
                    />
                  </FormField>
                </ColumnLayout>
              </Container>
            ))}
          </SpaceBetween>
        </Container>

        {showReview && (
          <Container
            header={
              <Header variant="h2">Customer Experience Map Review</Header>
            }
          >
            <SpaceBetween size="m">
              <ColumnLayout columns={2} variant="text-grid">
                <div>
                  <Box variant="awsui-key-label">Persona</Box>
                  <Box>{persona}</Box>
                </div>
                <div>
                  <Box variant="awsui-key-label">Scenario</Box>
                  <Box>{scenario}</Box>
                </div>
              </ColumnLayout>

              <Box variant="h4">Customer Journey</Box>
              {journeyStages
                .filter((js) => js.stage)
                .map((js, index) => (
                  <Box key={js.id} padding={{ vertical: "xs" }}>
                    <Box variant="awsui-key-label">
                      Stage {index + 1}: {js.stage}
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
                        <Box color="text-body-secondary">Emotion</Box>
                        {emotionOptions.find((opt) => opt.value === js.emotions)
                          ?.label || "-"}
                      </Box>
                      <Box fontSize="body-s">
                        <Box color="text-body-secondary">Action</Box>
                        {js.actions || "-"}
                      </Box>
                      <Box fontSize="body-s">
                        <Box color="text-body-secondary">Touchpoint</Box>
                        {js.touchpoints || "-"}
                      </Box>
                      <Box fontSize="body-s">
                        <Box color="text-body-secondary">Pain Point</Box>
                        {js.painPoints || "-"}
                      </Box>
                    </Grid>
                  </Box>
                ))}
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
