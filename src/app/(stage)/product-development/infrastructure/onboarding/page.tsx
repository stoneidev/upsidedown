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
  { value: "ec2", label: "EC2 - 단일 서버 또는 Auto Scaling 그룹" },
  { value: "eks", label: "EKS - Kubernetes 클러스터" },
  { value: "ecs", label: "ECS - 컨테이너 오케스트레이션" },
];

const databaseTypeOptions = [
  { value: "rds", label: "RDS - 관계형 데이터베이스" },
  { value: "dynamodb", label: "DynamoDB - NoSQL 데이터베이스" },
  { value: "both", label: "RDS + DynamoDB - 하이브리드 구성" },
  { value: "none", label: "데이터베이스 미사용" },
];

export default function InfrastructureOnboarding() {
  const { setSplitPanel, setHelpPanel } = useAppLayout();
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
      title: "개발 환경 설정",
      description: "로컬 개발 환경 및 IDE 설정",
      status: "pending",
      assignee: "",
      dueDate: "",
    },
    {
      id: "2",
      title: "CI/CD 파이프라인 구성",
      description: "빌드 및 배포 자동화 설정",
      status: "pending",
      assignee: "",
      dueDate: "",
    },
    {
      id: "3",
      title: "모니터링 시스템 구축",
      description: "로깅 및 알림 시스템 설정",
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
          header: "AI 검토 의견",
          children: (
            <SpaceBetween size="m">
              <Alert type="info" header="인프라 온보딩 계획 분석 완료">
                작성하신 온보딩 계획을 분석했습니다.
              </Alert>

              <Box variant="h4">프로젝트 정보 분석</Box>
              <Box variant="p">
                프로젝트 정보가 명확하게 정의되었습니다.
                <StatusIndicator type="success">Good</StatusIndicator>
              </Box>

              <Box variant="h4">온보딩 단계 분석</Box>
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
                      단계 {index + 1}
                    </Badge>{" "}
                    {step.assignee ? (
                      <StatusIndicator type="success">
                        담당자 지정됨
                      </StatusIndicator>
                    ) : (
                      <Box
                        variant="span"
                        color="text-status-error"
                        fontWeight="bold"
                      >
                        담당자 미지정
                      </Box>
                    )}
                  </Box>
                ))}
              </SpaceBetween>

              <Box variant="h4">개선 제안</Box>
              <SpaceBetween size="xs">
                <Box>• 각 단계별 의존성 관계 명시</Box>
                <Box>• 리스크 요인 및 대응 방안 추가</Box>
                <Box>• 단계별 체크리스트 상세화</Box>
              </SpaceBetween>
            </SpaceBetween>
          ),
        });
      } else {
        setSplitPanel({
          header: "인프라 온보딩 가이드",
          children: (
            <SpaceBetween size="m">
              <Box variant="h4">효과적인 인프라 온보딩</Box>
              <Box variant="p">
                체계적인 인프라 구축을 위한 단계별 계획을 수립하세요.
              </Box>
              <Box variant="h4">주요 고려사항</Box>
              <Box variant="p">
                • 개발 환경 표준화
                <br />
                • 자동화된 배포 프로세스
                <br />
                • 모니터링 및 알림 체계
                <br />
                • 보안 및 접근 제어
                <br />• 문서화 및 지식 공유
              </Box>
            </SpaceBetween>
          ),
        });
      }
    },
    [setSplitPanel, projectName, onboardingSteps]
  );

  useEffect(() => {
    updateSplitPanel(isReviewing);

    setHelpPanel({
      header: "Infrastructure Onboarding",
      children: (
        <SpaceBetween size="m">
          <Box variant="p">
            프로젝트의 인프라 구축을 위한 단계별 온보딩 계획을 수립하세요.
          </Box>
          <Box variant="h4">온보딩 단계</Box>
          <Box variant="p">
            • 개발 환경: 로컬 개발 환경 설정
            <br />
            • CI/CD: 빌드 및 배포 자동화
            <br />
            • 모니터링: 로깅 및 알림 시스템
            <br />
            • 보안: 접근 제어 및 보안 설정
            <br />• 문서화: 인프라 구성 문서 작성
          </Box>
        </SpaceBetween>
      ),
    });

    return () => {
      setSplitPanel(null);
      setHelpPanel(null);
    };
  }, [
    setSplitPanel,
    setHelpPanel,
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
    value: any
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
      newErrors.projectName = "프로젝트명을 입력해주세요.";
    }

    if (!projectDescription.trim()) {
      newErrors.projectDescription = "프로젝트 설명을 입력해주세요.";
    }

    const hasUnassignedSteps = onboardingSteps.some(
      (step) => !step.assignee.trim()
    );
    if (hasUnassignedSteps) {
      newErrors.onboardingSteps = "모든 단계에 담당자를 지정해주세요.";
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
          description="프로젝트의 인프라 구축을 위한 단계별 온보딩 계획을 수립합니다"
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
            header="검토 완료"
          >
            인프라 온보딩 계획이 작성되었습니다. 다음 단계로 진행할 수 있습니다.
          </Alert>
        )}

        <Container
          header={
            <Header
              variant="h2"
              description="온보딩할 프로젝트의 기본 정보를 입력하세요"
            >
              프로젝트 정보
            </Header>
          }
        >
          <SpaceBetween size="l">
            <FormField
              label="프로젝트명"
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
                placeholder="예: Product Management Platform"
              />
            </FormField>

            <FormField
              label="프로젝트 설명"
              description="프로젝트의 목적과 주요 기능을 설명하세요"
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
                placeholder="예: 제품 관리 프로세스를 지원하는 통합 플랫폼"
                rows={3}
              />
            </FormField>
          </SpaceBetween>
        </Container>

        <Container
          header={
            <Header variant="h2" description="AWS 인프라 구성을 선택하세요">
              인프라 구성
            </Header>
          }
        >
          <SpaceBetween size="l">
            <ColumnLayout columns={2}>
              <FormField label="리전">
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

              <FormField label="컴퓨팅 리소스">
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

              <FormField label="데이터베이스">
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

            <Box variant="h3">모니터링 및 관찰성</Box>
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

            <Box variant="h3">보안</Box>
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

            <Box variant="h3">네트워킹</Box>
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
              description="인프라 구축을 위한 단계별 온보딩 계획을 수립하세요"
            >
              온보딩 단계
            </Header>
          }
        >
          {errors.onboardingSteps && (
            <Alert type="error" header="오류">
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
                        <FormField label="담당자">
                          <Input
                            value={item.assignee}
                            onChange={({ detail }) =>
                              updateStep(item.id, "assignee", detail.value)
                            }
                            placeholder="담당자 이름"
                          />
                        </FormField>

                        <FormField label="상태">
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

                        <FormField label="기한">
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
          <Container header={<Header variant="h2">온보딩 계획 검토</Header>}>
            <SpaceBetween size="m">
              <ColumnLayout columns={2} variant="text-grid">
                <div>
                  <Box variant="awsui-key-label">프로젝트명</Box>
                  <Box>{projectName}</Box>
                </div>
                <div>
                  <Box variant="awsui-key-label">프로젝트 설명</Box>
                  <Box>{projectDescription}</Box>
                </div>
              </ColumnLayout>

              <Box variant="h4">인프라 구성</Box>
              <Grid
                gridDefinition={[
                  { colspan: 3 },
                  { colspan: 3 },
                  { colspan: 3 },
                  { colspan: 3 },
                ]}
              >
                <Box fontSize="body-s">
                  <Box color="text-body-secondary">리전</Box>
                  {regionOptions.find(
                    (opt) => opt.value === infrastructureConfig.region
                  )?.label || "-"}
                </Box>
                <Box fontSize="body-s">
                  <Box color="text-body-secondary">컴퓨팅</Box>
                  {computeTypeOptions.find(
                    (opt) => opt.value === infrastructureConfig.computeType
                  )?.label || "-"}
                </Box>
                <Box fontSize="body-s">
                  <Box color="text-body-secondary">데이터베이스</Box>
                  {databaseTypeOptions.find(
                    (opt) => opt.value === infrastructureConfig.databaseType
                  )?.label || "-"}
                </Box>
              </Grid>

              <Box variant="h4">모니터링</Box>
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
                    {infrastructureConfig.monitoring.xray ? "사용" : "미사용"}
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
                      ? "사용"
                      : "미사용"}
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
                      ? "사용"
                      : "미사용"}
                  </StatusIndicator>
                </Box>
              </Grid>

              <Box variant="h4">온보딩 단계</Box>
              <SpaceBetween size="s">
                {onboardingSteps.map((step, index) => (
                  <Box key={step.id} padding={{ vertical: "xs" }}>
                    <Box variant="awsui-key-label">
                      단계 {index + 1}: {step.title}
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
                        <Box color="text-body-secondary">상태</Box>
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
                        <Box color="text-body-secondary">담당자</Box>
                        {step.assignee || "-"}
                      </Box>
                      <Box fontSize="body-s">
                        <Box color="text-body-secondary">기한</Box>
                        {step.dueDate || "-"}
                      </Box>
                      <Box fontSize="body-s">
                        <Box color="text-body-secondary">설명</Box>
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
            검토
          </Button>
          <Button
            variant="primary"
            onClick={handleNext}
            iconAlign="right"
            iconName="arrow-right"
          >
            다음
          </Button>
        </SpaceBetween>
      </SpaceBetween>
    </ContentLayout>
  );
}
