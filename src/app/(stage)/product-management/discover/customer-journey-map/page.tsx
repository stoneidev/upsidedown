"use client";

import React, { useEffect, useState } from "react";
import {
  Container,
  ContentLayout,
  Header,
  SpaceBetween,
  FormField,
  Input,
  Textarea,
  Button,
  Cards,
  Badge,
  Icon,
  StatusIndicator,
  Alert,
  ColumnLayout,
} from "@cloudscape-design/components";
import { useAppLayout } from "@/app/context/AppLayoutContext";

interface JourneyPoint {
  id: string;
  stage: string;
  action: string;
  thought: string;
  emotion: string;
  painPoint: string;
  opportunity: string;
}

const emotionOptions = [
  { value: "very-happy", label: "Very Happy", color: "green" as const },
  { value: "happy", label: "Happy", color: "blue" as const },
  { value: "neutral", label: "Neutral", color: "grey" as const },
  { value: "frustrated", label: "Frustrated", color: "severity-high" as const },
  { value: "angry", label: "Angry", color: "red" as const },
];

export default function CustomerJourneyMap() {
  const { setSplitPanel, setHelpPanel, setSplitPanelOpen } = useAppLayout();

  const [journeyName, setJourneyName] = useState("");
  const [persona, setPersona] = useState("");
  const [goal, setGoal] = useState("");
  const [points, setPoints] = useState<JourneyPoint[]>([
    {
      id: "1",
      stage: "",
      action: "",
      thought: "",
      emotion: "neutral",
      painPoint: "",
      opportunity: "",
    },
  ]);
  const [showReview, setShowReview] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const addPoint = () => {
    const newId = (points.length + 1).toString();
    setPoints([
      ...points,
      {
        id: newId,
        stage: "",
        action: "",
        thought: "",
        emotion: "neutral",
        painPoint: "",
        opportunity: "",
      },
    ]);
  };

  const removePoint = (id: string) => {
    if (points.length > 1) {
      setPoints(points.filter((point) => point.id !== id));
    }
  };

  const updatePoint = (
    id: string,
    field: keyof JourneyPoint,
    value: string
  ) => {
    setPoints(
      points.map((point) =>
        point.id === id ? { ...point, [field]: value } : point
      )
    );
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!journeyName.trim()) {
      newErrors.journeyName = "Enter journey name";
    }

    if (!persona.trim()) {
      newErrors.persona = "Enter persona";
    }

    if (!goal.trim()) {
      newErrors.goal = "Enter goal";
    }

    const hasEmptyPoint = points.some(
      (p) => !p.stage.trim() || !p.action.trim()
    );
    if (hasEmptyPoint) {
      newErrors.points = "Fill in all required fields for each point";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleReview = () => {
    if (validate()) {
      setShowReview(true);
      setSplitPanelOpen(true);
    }
  };

  useEffect(() => {
    setSplitPanelOpen(false);
    setSplitPanel({
      header: "Customer Journey Map Analysis",
      children: (
        <SpaceBetween size="m">
          <Alert type="info" header="Journey Analysis Complete">
            Your customer journey has been analyzed.
          </Alert>

          <Header variant="h3">Journey Analysis</Header>
          <SpaceBetween size="xs">
            <StatusIndicator type="success">
              Total {points.length} stages defined
            </StatusIndicator>
            <StatusIndicator type="warning">
              Pain Points: {points.filter((p) => p.painPoint.trim()).length}
            </StatusIndicator>
            <StatusIndicator type="info">
              Opportunities: {points.filter((p) => p.opportunity.trim()).length}
            </StatusIndicator>
          </SpaceBetween>

          <Header variant="h3">Improvement Suggestions</Header>
          <SpaceBetween size="xs">
            <div>• Address key pain points in each stage</div>
            <div>• Leverage identified opportunities</div>
            <div>• Optimize emotional journey</div>
          </SpaceBetween>
        </SpaceBetween>
      ),
    });

    setHelpPanel({
      header: "Customer Journey Map Help",
      children: (
        <SpaceBetween size="m">
          <div>
            Create a customer journey map to visualize and analyze the customer
            experience.
          </div>
          <Header variant="h3">Key Terms</Header>
          <div>
            • Stage: Major phase in the customer journey
            <br />
            • Action: What the customer does
            <br />
            • Thought: What the customer thinks
            <br />
            • Emotion: How the customer feels
            <br />
            • Pain Point: Problems or frustrations
            <br />• Opportunity: Potential improvements
          </div>
        </SpaceBetween>
      ),
    });

    return () => {
      setSplitPanel(null);
      setHelpPanel(null);
      setSplitPanelOpen(false);
    };
  }, [setSplitPanel, setHelpPanel, setSplitPanelOpen, points]);

  return (
    <ContentLayout
      header={
        <Header
          variant="h1"
          description="Map and analyze the customer journey to identify opportunities for improvement"
        >
          Customer Journey Map
        </Header>
      }
    >
      <SpaceBetween size="l">
        {showReview && (
          <Alert
            type="success"
            dismissible
            onDismiss={() => setShowReview(false)}
            header="Review Complete"
          >
            Customer journey has been defined. You can edit if needed or proceed
            to the next step.
          </Alert>
        )}

        <Container
          header={
            <Header
              variant="h2"
              description="Enter basic information about the customer journey"
            >
              Basic Information
            </Header>
          }
        >
          <SpaceBetween size="l">
            <FormField
              label="Journey Name"
              errorText={errors.journeyName}
              stretch
            >
              <Input
                value={journeyName}
                onChange={({ detail }) => {
                  setJourneyName(detail.value);
                  setErrors({ ...errors, journeyName: "" });
                }}
                placeholder="e.g., New Customer Onboarding Journey"
              />
            </FormField>

            <FormField label="Persona" errorText={errors.persona} stretch>
              <Input
                value={persona}
                onChange={({ detail }) => {
                  setPersona(detail.value);
                  setErrors({ ...errors, persona: "" });
                }}
                placeholder="e.g., First-time Home Buyer"
              />
            </FormField>

            <FormField label="Goal" errorText={errors.goal} stretch>
              <Textarea
                value={goal}
                onChange={({ detail }) => {
                  setGoal(detail.value);
                  setErrors({ ...errors, goal: "" });
                }}
                placeholder="e.g., Successfully purchase their first home"
                rows={3}
              />
            </FormField>
          </SpaceBetween>
        </Container>

        <Container
          header={
            <Header
              variant="h2"
              description="Define each stage of the customer journey"
              actions={
                <Button iconName="add-plus" onClick={addPoint}>
                  Add Stage
                </Button>
              }
            >
              Journey Stages
            </Header>
          }
        >
          {errors.points && (
            <Alert type="error" header="Error">
              {errors.points}
            </Alert>
          )}

          <Cards
            cardDefinition={{
              header: (item) => (
                <SpaceBetween size="xs" direction="horizontal">
                  <Icon name="arrow-right" />
                  <div>{item.stage || `Stage ${item.id}`}</div>
                  <Badge
                    color={
                      emotionOptions.find((opt) => opt.value === item.emotion)
                        ?.color || "grey"
                    }
                  >
                    {
                      emotionOptions.find((opt) => opt.value === item.emotion)
                        ?.label
                    }
                  </Badge>
                </SpaceBetween>
              ),
              sections: [
                {
                  id: "details",
                  header: "Stage Details",
                  content: (item) => (
                    <SpaceBetween size="l">
                      <FormField label="Stage Name">
                        <Input
                          value={item.stage}
                          onChange={({ detail }) =>
                            updatePoint(item.id, "stage", detail.value)
                          }
                          placeholder="Enter stage name"
                        />
                      </FormField>

                      <FormField label="Customer Action">
                        <Textarea
                          value={item.action}
                          onChange={({ detail }) =>
                            updatePoint(item.id, "action", detail.value)
                          }
                          placeholder="What does the customer do?"
                          rows={2}
                        />
                      </FormField>

                      <FormField label="Customer Thought">
                        <Textarea
                          value={item.thought}
                          onChange={({ detail }) =>
                            updatePoint(item.id, "thought", detail.value)
                          }
                          placeholder="What is the customer thinking?"
                          rows={2}
                        />
                      </FormField>

                      <ColumnLayout columns={2}>
                        <FormField label="Emotion">
                          <SpaceBetween size="xs" direction="horizontal">
                            {emotionOptions.map((option) => (
                              <Button
                                key={option.value}
                                variant={
                                  item.emotion === option.value
                                    ? "primary"
                                    : "normal"
                                }
                                onClick={() =>
                                  updatePoint(item.id, "emotion", option.value)
                                }
                              >
                                {option.label}
                              </Button>
                            ))}
                          </SpaceBetween>
                        </FormField>
                      </ColumnLayout>

                      <FormField label="Pain Point">
                        <Textarea
                          value={item.painPoint}
                          onChange={({ detail }) =>
                            updatePoint(item.id, "painPoint", detail.value)
                          }
                          placeholder="What problems or frustrations does the customer experience?"
                          rows={2}
                        />
                      </FormField>

                      <FormField label="Opportunity">
                        <Textarea
                          value={item.opportunity}
                          onChange={({ detail }) =>
                            updatePoint(item.id, "opportunity", detail.value)
                          }
                          placeholder="What improvements could be made?"
                          rows={2}
                        />
                      </FormField>

                      <Button
                        iconName="close"
                        variant="link"
                        disabled={points.length === 1}
                        onClick={() => removePoint(item.id)}
                      >
                        Remove Stage
                      </Button>
                    </SpaceBetween>
                  ),
                },
              ],
            }}
            cardsPerRow={[{ cards: 1 }, { minWidth: 500, cards: 2 }]}
            items={points}
            loadingText="Loading"
            empty="No stages defined"
          />

          <div
            style={{ marginTop: "30px", textAlign: "center", overflow: "auto" }}
          >
            {points.length > 0 && (
              <div
                style={{
                  padding: "20px 0",
                  display: "flex",
                  justifyContent:
                    points.length > 4 ? "space-between" : "center",
                  alignItems: "center",
                  position: "relative",
                  minWidth:
                    points.length > 4 ? `${points.length * 120}px` : "auto",
                  gap: "10px",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "20px",
                    right: "20px",
                    height: "3px",
                    background: "#d5dbdb",
                    zIndex: 0,
                  }}
                />

                {/* Arrow */}
                {points.length > 1 &&
                  points.map((_, index) => {
                    if (index === points.length - 1) return null;
                    return (
                      <div
                        key={`arrow-${index}`}
                        style={{
                          position: "absolute",
                          top: "50%",
                          left: `calc(${
                            (100 / (points.length - 1)) * index
                          }% - 10px)`,
                          transform: "translateY(-50%)",
                          zIndex: 1,
                          color: "#2ea597",
                          fontSize: "24px",
                          fontWeight: "bold",
                          display: points.length <= 4 ? "none" : "block",
                        }}
                      >
                        →
                      </div>
                    );
                  })}

                {points.map((point, index) => {
                  // Extract initial from stage name or first letter of stage
                  const initial = point.stage
                    ? point.stage.charAt(0).toUpperCase()
                    : (index + 1).toString();

                  return (
                    <div
                      key={point.id}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        position: "relative",
                        zIndex: 1,
                        margin: "0 10px",
                        width: "120px",
                      }}
                    >
                      <div
                        style={{
                          width: "70px",
                          height: "70px",
                          borderRadius: "50%",
                          background:
                            point.emotion === "very-happy"
                              ? "#1d8102"
                              : point.emotion === "happy"
                              ? "#0073bb"
                              : point.emotion === "neutral"
                              ? "#5f6b7a"
                              : point.emotion === "frustrated"
                              ? "#f2a400"
                              : "#d13212",
                          color: "white",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: "bold",
                          marginBottom: "12px",
                          fontSize: "24px",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                          border: "2px solid white",
                        }}
                      >
                        {initial}
                      </div>
                      <div
                        style={{
                          width: "100%",
                          fontSize: "14px",
                          fontWeight: "500",
                          textAlign: "center",
                          wordBreak: "break-word",
                          background: "white",
                          padding: "6px 8px",
                          borderRadius: "4px",
                          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                          border: "1px solid #eaeded",
                        }}
                      >
                        {point.stage
                          ? point.stage.length > 20
                            ? `${point.stage.substring(0, 17)}...`
                            : point.stage
                          : `Stage ${index + 1}`}
                      </div>
                      {point.emotion && (
                        <div
                          style={{
                            fontSize: "12px",
                            color: "#5f6b7a",
                            marginTop: "4px",
                          }}
                        >
                          {
                            emotionOptions.find(
                              (opt) => opt.value === point.emotion
                            )?.label
                          }
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </Container>

        <SpaceBetween direction="horizontal" size="xs">
          <Button onClick={handleReview} iconAlign="right" iconName="search">
            Review
          </Button>
          <Button variant="primary" iconAlign="right" iconName="check">
            Save
          </Button>
        </SpaceBetween>
      </SpaceBetween>
    </ContentLayout>
  );
}
