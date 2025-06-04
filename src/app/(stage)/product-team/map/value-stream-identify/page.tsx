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
  Cards,
  Badge,
  Icon,
  StatusIndicator,
  Alert,
  ColumnLayout,
} from "@cloudscape-design/components";
import { useAppLayout } from "@/app/context/AppLayoutContext";

interface Activity {
  id: string;
  name: string;
  description: string;
  leadTime: string;
  painPoint: string;
  status: "value-add" | "non-value-add" | "necessary-non-value-add";
}

const statusOptions = [
  { value: "value-add", label: "Value Add", color: "green" as const },
  { value: "non-value-add", label: "Non-Value Add", color: "red" as const },
  {
    value: "necessary-non-value-add",
    label: "Necessary Non-Value Add",
    color: "blue" as const,
  },
];

export default function ValueStreamIdentify() {
  const { setSplitPanel, setHelpPanel, setSplitPanelOpen } = useAppLayout();

  const [streamName, setStreamName] = useState("");
  const [trigger, setTrigger] = useState("");
  const [value, setValue] = useState("");
  const [activities, setActivities] = useState<Activity[]>([
    {
      id: "1",
      name: "",
      description: "",
      leadTime: "",
      painPoint: "",
      status: "value-add",
    },
  ]);
  const [showReview, setShowReview] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const addActivity = () => {
    const newId = (activities.length + 1).toString();
    setActivities([
      ...activities,
      {
        id: newId,
        name: "",
        description: "",
        leadTime: "",
        painPoint: "",
        status: "value-add",
      },
    ]);
  };

  const removeActivity = (id: string) => {
    if (activities.length > 1) {
      setActivities(activities.filter((activity) => activity.id !== id));
    }
  };

  const updateActivity = (
    id: string,
    field: keyof Activity,
    value: string | Activity["status"]
  ) => {
    setActivities(
      activities.map((activity) =>
        activity.id === id ? { ...activity, [field]: value } : activity
      )
    );
  };

  const updateSplitPanel = useCallback(
    (reviewing: boolean) => {
      if (reviewing && streamName && activities.some((a) => a.name)) {
        setSplitPanel({
          header: "AI Review Opinion",
          children: (
            <SpaceBetween size="m">
              <Alert type="info" header="Value Stream Analysis Completed">
                You have analyzed the value stream.
              </Alert>

              <Header variant="h3">Value Stream Analysis</Header>
              <SpaceBetween size="xs">
                <StatusIndicator type="success">
                  Total {activities.length} activities defined
                </StatusIndicator>
                <StatusIndicator type="info">
                  Value Add activities:{" "}
                  {activities.filter((a) => a.status === "value-add").length}
                </StatusIndicator>
                <StatusIndicator type="warning">
                  Necessary Non-Value Add activities:{" "}
                  {
                    activities.filter(
                      (a) => a.status === "necessary-non-value-add"
                    ).length
                  }
                  units
                </StatusIndicator>
                <StatusIndicator type="error">
                  Non-Value Add activities:{" "}
                  {
                    activities.filter((a) => a.status === "non-value-add")
                      .length
                  }
                  units
                </StatusIndicator>
              </SpaceBetween>

              <Header variant="h3">Improvement Suggestions</Header>
              <SpaceBetween size="xs">
                <div>
                  • Review minimizing or removing Non-Value Add activities
                </div>
                <div>• Review optimizing activities with long lead time</div>
                <div>• Generate improvement ideas for key pain points</div>
              </SpaceBetween>
            </SpaceBetween>
          ),
        });
      } else {
        setSplitPanel({
          header: "Value Stream Writing Guide",
          children: (
            <SpaceBetween size="m">
              <Header variant="h3">Effective Value Stream Mapping</Header>
              <div>
                Value stream mapping is a tool to visualize the entire process
                through which a product or service is delivered to customers.
              </div>
              <Header variant="h3">Writing Tips</Header>
              <div>
                • Record the current state (As-Is) accurately
                <br />
                • Measure lead time for each activity
                <br />
                • Distinguish between Value Add and Non-Value Add activities
                <br />• Define value from customer perspective
              </div>
            </SpaceBetween>
          ),
        });
      }
    },
    [setSplitPanel, streamName, activities]
  );

  useEffect(() => {
    setSplitPanelOpen(false);
    updateSplitPanel(isReviewing);

    setHelpPanel({
      header: "Value Stream Identification Help",
      children: (
        <SpaceBetween size="m">
          <div>
            Identify the value stream and evaluate the value contribution of
            each activity to improve the process.
          </div>
          <Header variant="h3">Key Terms</Header>
          <div>
            • Trigger: Starting point of the value stream
            <br />
            • Activity: Each step in the process
            <br />
            • Lead Time: Time required for each activity
            <br />
            • Value Add: Activity that customers willingly pay for
            <br />• Pain Point: Problem or obstacle in the process
          </div>
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
    updateSplitPanel,
  ]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!streamName.trim()) {
      newErrors.streamName = "Enter value stream name.";
    }

    if (!trigger.trim()) {
      newErrors.trigger = "Enter trigger.";
    }

    if (!value.trim()) {
      newErrors.value = "Enter value.";
    }

    const hasEmptyActivity = activities.some((a) => !a.name.trim());
    if (hasEmptyActivity) {
      newErrors.activities = "Enter name for all activities.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleReview = () => {
    if (validate()) {
      setShowReview(true);
      setIsReviewing(true);
      setSplitPanelOpen(true);
    }
  };

  return (
    <ContentLayout
      header={
        <Header
          variant="h1"
          description="Identify and analyze the value stream of product or service delivery process"
        >
          Value Stream Identification
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
            Value stream has been defined. You can edit if needed or proceed to
            the next step.
          </Alert>
        )}

        <Container
          header={
            <Header
              variant="h2"
              description="Enter basic information about the value stream"
            >
              Basic Information
            </Header>
          }
        >
          <SpaceBetween size="l">
            <FormField
              label="Value Stream Name"
              errorText={errors.streamName}
              stretch
            >
              <Input
                value={streamName}
                onChange={({ detail }) => {
                  setStreamName(detail.value);
                  setErrors({ ...errors, streamName: "" });
                  setIsReviewing(false);
                }}
                placeholder="e.g., New Customer Onboarding Process"
              />
            </FormField>

            <FormField label="Trigger" errorText={errors.trigger} stretch>
              <Input
                value={trigger}
                onChange={({ detail }) => {
                  setTrigger(detail.value);
                  setErrors({ ...errors, trigger: "" });
                  setIsReviewing(false);
                }}
                placeholder="e.g., Sign Up Button Click"
              />
            </FormField>

            <FormField label="Value" errorText={errors.value} stretch>
              <Textarea
                value={value}
                onChange={({ detail }) => {
                  setValue(detail.value);
                  setErrors({ ...errors, value: "" });
                  setIsReviewing(false);
                }}
                placeholder="e.g., Enable new users to experience core product features and continue using the product"
                rows={3}
              />
            </FormField>
          </SpaceBetween>
        </Container>

        <Container
          header={
            <Header
              variant="h2"
              description="Define and analyze activities within the value stream"
              actions={
                <Button iconName="add-plus" onClick={addActivity}>
                  Add Activity
                </Button>
              }
            >
              Activities
            </Header>
          }
        >
          {errors.activities && (
            <Alert type="error" header="Error">
              {errors.activities}
            </Alert>
          )}

          <Cards
            cardDefinition={{
              header: (item) => (
                <SpaceBetween size="xs" direction="horizontal">
                  <Icon name="arrow-right" />
                  <div>{item.name || `Activity ${item.id}`}</div>
                  <Badge
                    color={
                      statusOptions.find((opt) => opt.value === item.status)
                        ?.color || "grey"
                    }
                  >
                    {
                      statusOptions.find((opt) => opt.value === item.status)
                        ?.label
                    }
                  </Badge>
                </SpaceBetween>
              ),
              sections: [
                {
                  id: "description",
                  header: "Detailed Information",
                  content: (item) => (
                    <SpaceBetween size="l">
                      <FormField label="Activity Name">
                        <Input
                          value={item.name}
                          onChange={({ detail }) =>
                            updateActivity(item.id, "name", detail.value)
                          }
                          placeholder="Enter activity name"
                        />
                      </FormField>

                      <FormField label="Description">
                        <Textarea
                          value={item.description}
                          onChange={({ detail }) =>
                            updateActivity(item.id, "description", detail.value)
                          }
                          placeholder="Description of the activity"
                          rows={2}
                        />
                      </FormField>

                      <ColumnLayout columns={2}>
                        <FormField label="Lead Time">
                          <Input
                            value={item.leadTime}
                            onChange={({ detail }) =>
                              updateActivity(item.id, "leadTime", detail.value)
                            }
                            placeholder="e.g., 2 hours, 3 days"
                          />
                        </FormField>

                        <FormField label="Status">
                          <SpaceBetween size="xs" direction="horizontal">
                            {statusOptions.map((option) => (
                              <Button
                                key={option.value}
                                variant={
                                  item.status === option.value
                                    ? "primary"
                                    : "normal"
                                }
                                onClick={() =>
                                  updateActivity(
                                    item.id,
                                    "status",
                                    option.value as Activity["status"]
                                  )
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
                            updateActivity(item.id, "painPoint", detail.value)
                          }
                          placeholder="Problems or obstacles in this activity"
                          rows={2}
                        />
                      </FormField>

                      <Button
                        iconName="close"
                        variant="link"
                        disabled={activities.length === 1}
                        onClick={() => removeActivity(item.id)}
                      >
                        Remove Activity
                      </Button>
                    </SpaceBetween>
                  ),
                },
              ],
            }}
            cardsPerRow={[{ cards: 1 }, { minWidth: 500, cards: 2 }]}
            items={activities}
            loadingText="Loading"
            empty="No activities"
          />

          <div
            style={{ marginTop: "30px", textAlign: "center", overflow: "auto" }}
          >
            {activities.length > 0 && (
              <div
                style={{
                  padding: "20px 0",
                  display: "flex",
                  justifyContent:
                    activities.length > 4 ? "space-between" : "center",
                  alignItems: "center",
                  position: "relative",
                  minWidth:
                    activities.length > 4
                      ? `${activities.length * 120}px`
                      : "auto",
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
                {activities.length > 1 &&
                  activities.map((_, index) => {
                    if (index === activities.length - 1) return null;
                    return (
                      <div
                        key={`arrow-${index}`}
                        style={{
                          position: "absolute",
                          top: "50%",
                          left: `calc(${
                            (100 / (activities.length - 1)) * index
                          }% - 10px)`,
                          transform: "translateY(-50%)",
                          zIndex: 1,
                          color: "#2ea597",
                          fontSize: "24px",
                          fontWeight: "bold",
                          display: activities.length <= 4 ? "none" : "block",
                        }}
                      >
                        →
                      </div>
                    );
                  })}

                {activities.map((activity, index) => {
                  // Extract initial from activity name or first letter of activity
                  const initial = activity.name
                    ? activity.name.charAt(0).toUpperCase()
                    : (index + 1).toString();

                  return (
                    <div
                      key={activity.id}
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
                            activity.status === "value-add"
                              ? "#0073bb"
                              : activity.status === "necessary-non-value-add"
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
                        {activity.name
                          ? activity.name.length > 20
                            ? `${activity.name.substring(0, 17)}...`
                            : activity.name
                          : `Activity ${index + 1}`}
                      </div>
                      {activity.leadTime && (
                        <div
                          style={{
                            fontSize: "12px",
                            color: "#5f6b7a",
                            marginTop: "4px",
                          }}
                        >
                          {activity.leadTime}
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
