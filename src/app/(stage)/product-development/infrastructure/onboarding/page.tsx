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
  StatusIndicator,
  Badge,
  Select,
  SelectProps,
  Cards,
  Grid,
  Toggle,
  RadioGroup,
} from "@cloudscape-design/components";
import { useAppLayout } from "@/app/context/AppLayoutContext";
import { useRouter } from "next/navigation";

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  status: "pending" | "in-progress" | "completed";
  assignee: string;
  dueDate: string;
}

interface InfrastructureConfig {
  region: string;
  computeType: "ec2" | "eks" | "ecs";
  databaseType: "rds" | "dynamodb" | "both" | "none";
  monitoring: {
    xray: boolean;
    cloudwatch: boolean;
    prometheus: boolean;
  };
  security: {
    waf: boolean;
    shield: boolean;
    guardduty: boolean;
  };
  networking: {
    vpc: boolean;
    alb: boolean;
    route53: boolean;
  };
}

const statusOptions: SelectProps.Option[] = [
  { label: "대기중", value: "pending" },
  { label: "진행중", value: "in-progress" },
  { label: "완료", value: "completed" },
];

const regionOptions: SelectProps.Option[] = [
  { label: "아시아 태평양 (서울) ap-northeast-2", value: "ap-northeast-2" },
  { label: "아시아 태평양 (도쿄) ap-northeast-1", value: "ap-northeast-1" },
  { label: "아시아 태평양 (싱가포르) ap-southeast-1", value: "ap-southeast-1" },
  { label: "미국 동부 (버지니아) us-east-1", value: "us-east-1" },
  { label: "미국 서부 (오레곤) us-west-2", value: "us-west-2" },
];

const computeTypeOptions = [
  { value: "ec2", label: "EC2 - Single server or Auto Scaling Group" },
  { value: "eks", label: "EKS - Kubernetes Cluster" },
  { value: "ecs", label: "ECS - Container Orchestration" },
];

const databaseTypeOptions = [
  { value: "rds", label: "RDS - Relational Database" },
  { value: "dynamodb", label: "DynamoDB - NoSQL Database" },
  { value: "both", label: "RDS + DynamoDB - Hybrid Configuration" },
  { value: "none", label: "No Database" },
];

export default function InfrastructureOnboarding() {
  const { setSplitPanel, setHelpPanel, setSplitPanelOpen } = useAppLayout();
  const router = useRouter();

  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [infrastructureConfig, setInfrastructureConfig] =
    useState<InfrastructureConfig>({
      region: "ap-northeast-2",
      computeType: "ec2",
      databaseType: "rds",
      monitoring: {
        xray: false,
        cloudwatch: true,
        prometheus: false,
      },
      security: {
        waf: false,
        shield: false,
        guardduty: false,
      },
      networking: {
        vpc: true,
        alb: true,
        route53: false,
      },
    });
  const [onboardingSteps, setOnboardingSteps] = useState<OnboardingStep[]>([
    {
      id: "1",
      title: "Development Environment Setup",
      description: "Setting up local development environment and IDE",
      status: "pending",
      assignee: "",
      dueDate: "",
    },
    {
      id: "2",
      title: "CI/CD Pipeline Configuration",
      description: "Setting up automated build and deployment",
      status: "pending",
      assignee: "",
      dueDate: "",
    },
    {
      id: "3",
      title: "Monitoring System Setup",
      description: "Setting up logging and notification system",
      status: "pending",
      assignee: "",
      dueDate: "",
    },
  ]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showReview, setShowReview] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);

  const updateSplitPanel = useCallback(
    (reviewing: boolean) => {
      if (reviewing && projectName && onboardingSteps.length > 0) {
        setSplitPanel({
          header: "AI Review Feedback",
          children: (
            <SpaceBetween size="m">
              <Alert
                type="info"
                header="Infrastructure Onboarding Plan Analysis Completed"
              >
                We analyzed your Onboarding Plan.
              </Alert>

              <Box variant="h4">Project Information Analysis</Box>
              <Box variant="p">
                Your project information is clearly defined.
                <StatusIndicator type="success">Good</StatusIndicator>
              </Box>

              <Box variant="h4">Onboarding Step Analysis</Box>
              <SpaceBetween size="xs">
                {onboardingSteps.map((step, index) => (
                  <Box key={step.id}>
                    <Badge
                      color={
                        step.status === "completed"
                          ? "green"
                          : step.status === "in-progress"
                          ? "blue"
                          : "grey"
                      }
                    >
                      Step {index + 1}
                    </Badge>{" "}
                    {step.assignee ? (
                      <StatusIndicator type="success">Assigned</StatusIndicator>
                    ) : (
                      <Box
                        variant="span"
                        color="text-status-error"
                        fontWeight="bold"
                      >
                        Unassigned
                      </Box>
                    )}
                  </Box>
                ))}
              </SpaceBetween>

              <Box variant="h4">Improvement Suggestions</Box>
              <SpaceBetween size="xs">
                <Box>• Specify Dependency Relationships Between Steps</Box>
                <Box>• Add Risk Factors and Corresponding Actions</Box>
                <Box>• Detailed Checklists for Each Step</Box>
              </SpaceBetween>
            </SpaceBetween>
          ),
        });
      } else {
        setSplitPanel({
          header: "Infrastructure Onboarding Guide",
          children: (
            <SpaceBetween size="m">
              <Box variant="h4">Effective Infrastructure Onboarding</Box>
              <Box variant="p">
                Plan your step-by-step approach for a systematic infrastructure
                setup.
              </Box>
              <Box variant="h4">Key Considerations</Box>
              <Box variant="p">
                • Standardization of Development Environment
                <br />
                • Automated Deployment Process
                <br />
                • Monitoring and Notification System
                <br />
                • Security and Access Control
                <br />• Documentation and Knowledge Sharing
              </Box>
            </SpaceBetween>
          ),
        });
      }
    },
    [setSplitPanel, projectName, onboardingSteps]
  );

  useEffect(() => {
    setSplitPanelOpen(false);
    updateSplitPanel(isReviewing);

    setHelpPanel({
      header: "Infrastructure Onboarding",
      children: (
        <SpaceBetween size="m">
          <Box variant="p">
            Plan your step-by-step approach for a systematic infrastructure
            setup.
          </Box>
          <Box variant="h4">Onboarding Steps</Box>
          <Box variant="p">
            • Development Environment: Setting up local development environment
            <br />
            • CI/CD: Automated build and deployment
            <br />
            • Monitoring: Logging and notification system
            <br />
            • Security: Access control and security setup
            <br />• Documentation: Writing infrastructure configuration
            documents
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
    projectName,
    onboardingSteps,
    updateSplitPanel,
  ]);

  const updateStep = (
    id: string,
    field: keyof OnboardingStep,
    value: string
  ) => {
    setOnboardingSteps(
      onboardingSteps.map((step) =>
        step.id === id ? { ...step, [field]: value } : step
      )
    );
    setIsReviewing(false);
  };

  const updateInfrastructureConfig = (
    section: keyof InfrastructureConfig,
    field: string,
    value: unknown
  ) => {
    setInfrastructureConfig((prev) => ({
      ...prev,
      [section]:
        typeof prev[section] === "object"
          ? { ...prev[section], [field]: value }
          : value,
    }));
    setIsReviewing(false);
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!projectName.trim()) {
      newErrors.projectName = "Please enter the project name.";
    }

    if (!projectDescription.trim()) {
      newErrors.projectDescription = "Please enter the project description.";
    }

    const hasUnassignedSteps = onboardingSteps.some(
      (step) => !step.assignee.trim()
    );
    if (hasUnassignedSteps) {
      newErrors.onboardingSteps = "Please assign an assignee to all steps.";
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
      router.push("/product-development/infrastructure/monitoring");
    }
  };

  return (
    <ContentLayout
      header={
        <Header
          variant="h1"
          description="Plan your step-by-step approach for a systematic infrastructure setup."
        >
          Infrastructure Onboarding
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
            Your infrastructure onboarding plan has been created. You can
            proceed to the next step.
          </Alert>
        )}

        <Container
          header={
            <Header
              variant="h2"
              description="Enter the basic information of the project you want to onboard"
            >
              Project Information
            </Header>
          }
        >
          <SpaceBetween size="l">
            <FormField
              label="Project Name"
              errorText={errors.projectName}
              stretch
            >
              <Input
                value={projectName}
                onChange={({ detail }) => {
                  setProjectName(detail.value);
                  setErrors({ ...errors, projectName: "" });
                  setIsReviewing(false);
                }}
                placeholder="e.g., Product Management Platform"
              />
            </FormField>

            <FormField
              label="Project Description"
              description="Describe the purpose and main features of the project."
              errorText={errors.projectDescription}
              stretch
            >
              <Textarea
                value={projectDescription}
                onChange={({ detail }) => {
                  setProjectDescription(detail.value);
                  setErrors({ ...errors, projectDescription: "" });
                  setIsReviewing(false);
                }}
                placeholder="e.g., An integrated platform that supports product management processes."
                rows={3}
              />
            </FormField>
          </SpaceBetween>
        </Container>

        <Container
          header={
            <Header
              variant="h2"
              description="Select AWS Infrastructure Configuration"
            >
              Infrastructure Configuration
            </Header>
          }
        >
          <SpaceBetween size="l">
            <ColumnLayout columns={2}>
              <FormField label="Region">
                <Select
                  selectedOption={
                    regionOptions.find(
                      (opt) => opt.value === infrastructureConfig.region
                    ) || null
                  }
                  onChange={({ detail }) =>
                    updateInfrastructureConfig(
                      "region",
                      "region",
                      detail.selectedOption?.value
                    )
                  }
                  options={regionOptions}
                />
              </FormField>

              <FormField label="Computing Resource">
                <RadioGroup
                  value={infrastructureConfig.computeType}
                  onChange={({ detail }) =>
                    updateInfrastructureConfig(
                      "computeType",
                      "computeType",
                      detail.value
                    )
                  }
                  items={computeTypeOptions}
                />
              </FormField>

              <FormField label="Database">
                <RadioGroup
                  value={infrastructureConfig.databaseType}
                  onChange={({ detail }) =>
                    updateInfrastructureConfig(
                      "databaseType",
                      "databaseType",
                      detail.value
                    )
                  }
                  items={databaseTypeOptions}
                />
              </FormField>
            </ColumnLayout>

            <Box variant="h3">Monitoring and Observability</Box>
            <ColumnLayout columns={3}>
              <FormField>
                <Toggle
                  checked={infrastructureConfig.monitoring.xray}
                  onChange={({ detail }) =>
                    updateInfrastructureConfig(
                      "monitoring",
                      "xray",
                      detail.checked
                    )
                  }
                >
                  AWS X-Ray
                </Toggle>
              </FormField>

              <FormField>
                <Toggle
                  checked={infrastructureConfig.monitoring.cloudwatch}
                  onChange={({ detail }) =>
                    updateInfrastructureConfig(
                      "monitoring",
                      "cloudwatch",
                      detail.checked
                    )
                  }
                >
                  CloudWatch
                </Toggle>
              </FormField>

              <FormField>
                <Toggle
                  checked={infrastructureConfig.monitoring.prometheus}
                  onChange={({ detail }) =>
                    updateInfrastructureConfig(
                      "monitoring",
                      "prometheus",
                      detail.checked
                    )
                  }
                >
                  Prometheus
                </Toggle>
              </FormField>
            </ColumnLayout>

            <Box variant="h3">Security</Box>
            <ColumnLayout columns={3}>
              <FormField>
                <Toggle
                  checked={infrastructureConfig.security.waf}
                  onChange={({ detail }) =>
                    updateInfrastructureConfig(
                      "security",
                      "waf",
                      detail.checked
                    )
                  }
                >
                  WAF
                </Toggle>
              </FormField>

              <FormField>
                <Toggle
                  checked={infrastructureConfig.security.shield}
                  onChange={({ detail }) =>
                    updateInfrastructureConfig(
                      "security",
                      "shield",
                      detail.checked
                    )
                  }
                >
                  Shield
                </Toggle>
              </FormField>

              <FormField>
                <Toggle
                  checked={infrastructureConfig.security.guardduty}
                  onChange={({ detail }) =>
                    updateInfrastructureConfig(
                      "security",
                      "guardduty",
                      detail.checked
                    )
                  }
                >
                  GuardDuty
                </Toggle>
              </FormField>
            </ColumnLayout>

            <Box variant="h3">Networking</Box>
            <ColumnLayout columns={3}>
              <FormField>
                <Toggle
                  checked={infrastructureConfig.networking.vpc}
                  onChange={({ detail }) =>
                    updateInfrastructureConfig(
                      "networking",
                      "vpc",
                      detail.checked
                    )
                  }
                >
                  VPC
                </Toggle>
              </FormField>

              <FormField>
                <Toggle
                  checked={infrastructureConfig.networking.alb}
                  onChange={({ detail }) =>
                    updateInfrastructureConfig(
                      "networking",
                      "alb",
                      detail.checked
                    )
                  }
                >
                  ALB
                </Toggle>
              </FormField>

              <FormField>
                <Toggle
                  checked={infrastructureConfig.networking.route53}
                  onChange={({ detail }) =>
                    updateInfrastructureConfig(
                      "networking",
                      "route53",
                      detail.checked
                    )
                  }
                >
                  Route 53
                </Toggle>
              </FormField>
            </ColumnLayout>
          </SpaceBetween>
        </Container>

        <Container
          header={
            <Header
              variant="h2"
              description="Plan your step-by-step approach for a systematic infrastructure setup."
            >
              Onboarding Steps
            </Header>
          }
        >
          {errors.onboardingSteps && (
            <Alert type="error" header="Error">
              {errors.onboardingSteps}
            </Alert>
          )}

          <Cards
            cardDefinition={{
              header: (item) => (
                <SpaceBetween size="xs" direction="horizontal">
                  <Box fontWeight="bold">{item.title}</Box>
                  <Badge
                    color={
                      item.status === "completed"
                        ? "green"
                        : item.status === "in-progress"
                        ? "blue"
                        : "grey"
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
                  content: (item) => (
                    <SpaceBetween size="m">
                      <Box>{item.description}</Box>
                      <ColumnLayout columns={2}>
                        <FormField label="Assignee">
                          <Input
                            value={item.assignee}
                            onChange={({ detail }) =>
                              updateStep(item.id, "assignee", detail.value)
                            }
                            placeholder="Assignee Name"
                          />
                        </FormField>

                        <FormField label="Status">
                          <Select
                            selectedOption={
                              statusOptions.find(
                                (opt) => opt.value === item.status
                              ) || null
                            }
                            onChange={({ detail }) =>
                              updateStep(
                                item.id,
                                "status",
                                detail.selectedOption?.value || "pending"
                              )
                            }
                            options={statusOptions}
                          />
                        </FormField>

                        <FormField label="Due Date">
                          <Input
                            value={item.dueDate}
                            onChange={({ detail }) =>
                              updateStep(item.id, "dueDate", detail.value)
                            }
                            placeholder="YYYY-MM-DD"
                          />
                        </FormField>
                      </ColumnLayout>
                    </SpaceBetween>
                  ),
                },
              ],
            }}
            cardsPerRow={[{ cards: 1 }]}
            items={onboardingSteps}
            loadingText="Loading steps"
            empty="No steps"
          />
        </Container>

        {showReview && (
          <Container
            header={<Header variant="h2">Onboarding Plan Review</Header>}
          >
            <SpaceBetween size="m">
              <ColumnLayout columns={2} variant="text-grid">
                <div>
                  <Box variant="awsui-key-label">Project Name</Box>
                  <Box>{projectName}</Box>
                </div>
                <div>
                  <Box variant="awsui-key-label">Project Description</Box>
                  <Box>{projectDescription}</Box>
                </div>
              </ColumnLayout>

              <Box variant="h4">Infrastructure Configuration</Box>
              <Grid
                gridDefinition={[
                  { colspan: 3 },
                  { colspan: 3 },
                  { colspan: 3 },
                  { colspan: 3 },
                ]}
              >
                <Box fontSize="body-s">
                  <Box color="text-body-secondary">Region</Box>
                  {regionOptions.find(
                    (opt) => opt.value === infrastructureConfig.region
                  )?.label || "-"}
                </Box>
                <Box fontSize="body-s">
                  <Box color="text-body-secondary">Computing</Box>
                  {computeTypeOptions.find(
                    (opt) => opt.value === infrastructureConfig.computeType
                  )?.label || "-"}
                </Box>
                <Box fontSize="body-s">
                  <Box color="text-body-secondary">Database</Box>
                  {databaseTypeOptions.find(
                    (opt) => opt.value === infrastructureConfig.databaseType
                  )?.label || "-"}
                </Box>
              </Grid>

              <Box variant="h4">Monitoring</Box>
              <Grid
                gridDefinition={[
                  { colspan: 4 },
                  { colspan: 4 },
                  { colspan: 4 },
                ]}
              >
                <Box fontSize="body-s">
                  <Box color="text-body-secondary">X-Ray</Box>
                  <StatusIndicator
                    type={
                      infrastructureConfig.monitoring.xray
                        ? "success"
                        : "stopped"
                    }
                  >
                    {infrastructureConfig.monitoring.xray ? "Used" : "Not Used"}
                  </StatusIndicator>
                </Box>
                <Box fontSize="body-s">
                  <Box color="text-body-secondary">CloudWatch</Box>
                  <StatusIndicator
                    type={
                      infrastructureConfig.monitoring.cloudwatch
                        ? "success"
                        : "stopped"
                    }
                  >
                    {infrastructureConfig.monitoring.cloudwatch
                      ? "Used"
                      : "Not Used"}
                  </StatusIndicator>
                </Box>
                <Box fontSize="body-s">
                  <Box color="text-body-secondary">Prometheus</Box>
                  <StatusIndicator
                    type={
                      infrastructureConfig.monitoring.prometheus
                        ? "success"
                        : "stopped"
                    }
                  >
                    {infrastructureConfig.monitoring.prometheus
                      ? "Used"
                      : "Not Used"}
                  </StatusIndicator>
                </Box>
              </Grid>

              <Box variant="h4">Onboarding Steps</Box>
              <SpaceBetween size="s">
                {onboardingSteps.map((step, index) => (
                  <Box key={step.id} padding={{ vertical: "xs" }}>
                    <Box variant="awsui-key-label">
                      Step {index + 1}: {step.title}
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
                        <Box color="text-body-secondary">Status</Box>
                        <Badge
                          color={
                            step.status === "completed"
                              ? "green"
                              : step.status === "in-progress"
                              ? "blue"
                              : "grey"
                          }
                        >
                          {statusOptions.find(
                            (opt) => opt.value === step.status
                          )?.label || "-"}
                        </Badge>
                      </Box>
                      <Box fontSize="body-s">
                        <Box color="text-body-secondary">Assignee</Box>
                        {step.assignee || "-"}
                      </Box>
                      <Box fontSize="body-s">
                        <Box color="text-body-secondary">Due Date</Box>
                        {step.dueDate || "-"}
                      </Box>
                      <Box fontSize="body-s">
                        <Box color="text-body-secondary">Description</Box>
                        {step.description}
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
