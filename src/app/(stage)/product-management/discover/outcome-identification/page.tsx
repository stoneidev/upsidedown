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

interface Outcome {
  id: string;
  name: string;
  description: string;
  metric: string;
  target: string;
  timeframe: string;
  impact: "high" | "medium" | "low";
}

const impactOptions = [
  { value: "high", label: "높음 - 비즈니스에 중대한 영향" },
  { value: "medium", label: "중간 - 보통 수준의 영향" },
  { value: "low", label: "낮음 - 제한적인 영향" },
];

export default function OutcomeIdentification() {
  const { setSplitPanel, setHelpPanel } = useAppLayout();
  const router = useRouter();

  const [problemStatement, setProblemStatement] = useState("");
  const [outcomes, setOutcomes] = useState<Outcome[]>([]);
  const [currentOutcome, setCurrentOutcome] = useState<Outcome>({
    id: "",
    name: "",
    description: "",
    metric: "",
    target: "",
    timeframe: "",
    impact: "medium",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showReview, setShowReview] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const updateSplitPanel = useCallback(
    (reviewing: boolean) => {
      if (reviewing && problemStatement && outcomes.length > 0) {
        setSplitPanel({
          header: "AI 검토 의견",
          children: (
            <SpaceBetween size="m">
              <Alert type="info" header="성과 식별 분석 완료">
                작성하신 성과 지표를 분석했습니다.
              </Alert>

              <Box variant="h4">문제 정의 분석</Box>
              <Box variant="p">
                문제가 명확하게 정의되었습니다.
                <StatusIndicator type="success">Good</StatusIndicator>
              </Box>

              <Box variant="h4">성과 지표 분석</Box>
              <SpaceBetween size="xs">
                {outcomes.map((outcome, index) => (
                  <Box key={outcome.id}>
                    <Badge
                      color={
                        outcome.impact === "high"
                          ? "red"
                          : outcome.impact === "medium"
                          ? "blue"
                          : "grey"
                      }
                    >
                      성과 {index + 1}
                    </Badge>{" "}
                    {outcome.metric && outcome.target ? (
                      <StatusIndicator type="success">
                        측정 가능
                      </StatusIndicator>
                    ) : (
                      <Box
                        variant="span"
                        color="text-status-error"
                        fontWeight="bold"
                      >
                        측정 지표 불완전
                      </Box>
                    )}
                  </Box>
                ))}
              </SpaceBetween>

              <Box variant="h4">개선 제안</Box>
              <Box variant="p">
                <Box variant="span" color="text-status-error" fontWeight="bold">
                  각 성과의 상호 의존성과 우선순위를 더 명확히 하세요.
                </Box>
              </Box>

              <Box variant="h4">추천 사항</Box>
              <SpaceBetween size="xs">
                <Box>• 선행 지표와 후행 지표 구분</Box>
                <Box>• 각 성과 간 인과관계 명시</Box>
                <Box>• 리스크 요인 및 대응 방안 추가</Box>
              </SpaceBetween>
            </SpaceBetween>
          ),
        });
      } else {
        setSplitPanel({
          header: "성과 식별 가이드",
          children: (
            <SpaceBetween size="m">
              <Box variant="h4">효과적인 성과 정의</Box>
              <Box variant="p">
                비즈니스 성과는 구체적이고 측정 가능해야 합니다.
              </Box>
              <Box variant="h4">SMART 원칙</Box>
              <Box variant="p">
                • Specific: 구체적
                <br />
                • Measurable: 측정 가능
                <br />
                • Achievable: 달성 가능
                <br />
                • Relevant: 관련성
                <br />• Time-bound: 기한 설정
              </Box>
            </SpaceBetween>
          ),
        });
      }
    },
    [setSplitPanel, problemStatement, outcomes]
  );

  useEffect(() => {
    updateSplitPanel(isReviewing);

    setHelpPanel({
      header: "Outcome Identification",
      children: (
        <SpaceBetween size="m">
          <Box variant="p">
            비즈니스 문제를 해결하기 위한 구체적인 성과를 정의하세요.
          </Box>
          <Box variant="h4">성과 구성 요소</Box>
          <Box variant="p">
            • 성과명: 달성하고자 하는 결과
            <br />
            • 측정 지표: 정량적 측정 방법
            <br />
            • 목표치: 구체적인 수치 목표
            <br />
            • 기한: 달성 시점
            <br />• 영향도: 비즈니스 임팩트
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
    problemStatement,
    outcomes,
    updateSplitPanel,
  ]);

  const validateOutcome = () => {
    const newErrors: Record<string, string> = {};

    if (!currentOutcome.name.trim()) {
      newErrors.outcomeName = "성과명을 입력해주세요.";
    }
    if (!currentOutcome.metric.trim()) {
      newErrors.outcomeMetric = "측정 지표를 입력해주세요.";
    }
    if (!currentOutcome.target.trim()) {
      newErrors.outcomeTarget = "목표치를 입력해주세요.";
    }
    if (!currentOutcome.timeframe.trim()) {
      newErrors.outcomeTimeframe = "기한을 입력해주세요.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const addOutcome = () => {
    if (validateOutcome()) {
      const newOutcome = {
        ...currentOutcome,
        id: Date.now().toString(),
      };
      setOutcomes([...outcomes, newOutcome]);
      setCurrentOutcome({
        id: "",
        name: "",
        description: "",
        metric: "",
        target: "",
        timeframe: "",
        impact: "medium",
      });
      setIsAdding(false);
      setErrors({});
    }
  };

  const removeOutcome = (id: string) => {
    setOutcomes(outcomes.filter((o) => o.id !== id));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!problemStatement.trim()) {
      newErrors.problemStatement = "문제 정의를 입력해주세요.";
    }

    if (outcomes.length === 0) {
      newErrors.outcomes = "최소 하나 이상의 성과를 추가해주세요.";
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
          description="비즈니스 문제 해결을 위한 구체적인 성과를 정의합니다"
        >
          Outcome Identification
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
            성과 지표가 정의되었습니다. 다음 단계로 진행할 수 있습니다.
          </Alert>
        )}

        <Container
          header={
            <Header
              variant="h2"
              description="해결하고자 하는 핵심 문제를 명확히 정의하세요"
            >
              문제 정의
            </Header>
          }
        >
          <FormField
            label="문제 진술"
            description="현재 상황과 이상적인 상황의 차이를 구체적으로 설명하세요"
            errorText={errors.problemStatement}
            stretch
          >
            <Textarea
              value={problemStatement}
              onChange={({ detail }) => {
                setProblemStatement(detail.value);
                setErrors({ ...errors, problemStatement: "" });
                setIsReviewing(false);
              }}
              placeholder="예: 신규 사용자의 30일 내 이탈률이 60%로 높아 제품의 가치를 충분히 경험하지 못하고 있다"
              rows={3}
            />
          </FormField>
        </Container>

        <Container
          header={
            <Header
              variant="h2"
              description="문제 해결을 위한 측정 가능한 성과를 정의하세요"
              actions={
                !isAdding && (
                  <Button iconName="add-plus" onClick={() => setIsAdding(true)}>
                    성과 추가
                  </Button>
                )
              }
            >
              비즈니스 성과
            </Header>
          }
        >
          {errors.outcomes && <Alert type="error">{errors.outcomes}</Alert>}

          {isAdding && (
            <Container>
              <SpaceBetween size="l">
                <ColumnLayout columns={2}>
                  <FormField label="성과명" errorText={errors.outcomeName}>
                    <Input
                      value={currentOutcome.name}
                      onChange={({ detail }) =>
                        setCurrentOutcome({
                          ...currentOutcome,
                          name: detail.value,
                        })
                      }
                      placeholder="예: 신규 사용자 리텐션 향상"
                    />
                  </FormField>

                  <FormField label="영향도">
                    <RadioGroup
                      onChange={({ detail }) =>
                        setCurrentOutcome({
                          ...currentOutcome,
                          impact: detail.value as "high" | "medium" | "low",
                        })
                      }
                      value={currentOutcome.impact}
                      items={impactOptions}
                    />
                  </FormField>

                  <FormField label="측정 지표" errorText={errors.outcomeMetric}>
                    <Input
                      value={currentOutcome.metric}
                      onChange={({ detail }) =>
                        setCurrentOutcome({
                          ...currentOutcome,
                          metric: detail.value,
                        })
                      }
                      placeholder="예: 30일 리텐션율"
                    />
                  </FormField>

                  <FormField label="목표치" errorText={errors.outcomeTarget}>
                    <Input
                      value={currentOutcome.target}
                      onChange={({ detail }) =>
                        setCurrentOutcome({
                          ...currentOutcome,
                          target: detail.value,
                        })
                      }
                      placeholder="예: 40% → 70%"
                    />
                  </FormField>

                  <FormField label="기한" errorText={errors.outcomeTimeframe}>
                    <Input
                      value={currentOutcome.timeframe}
                      onChange={({ detail }) =>
                        setCurrentOutcome({
                          ...currentOutcome,
                          timeframe: detail.value,
                        })
                      }
                      placeholder="예: 2024년 Q2"
                    />
                  </FormField>

                  <FormField label="설명 (선택)">
                    <Textarea
                      value={currentOutcome.description}
                      onChange={({ detail }) =>
                        setCurrentOutcome({
                          ...currentOutcome,
                          description: detail.value,
                        })
                      }
                      placeholder="성과에 대한 추가 설명"
                      rows={2}
                    />
                  </FormField>
                </ColumnLayout>

                <SpaceBetween size="xs" direction="horizontal">
                  <Button onClick={() => setIsAdding(false)}>취소</Button>
                  <Button variant="primary" onClick={addOutcome}>
                    추가
                  </Button>
                </SpaceBetween>
              </SpaceBetween>
            </Container>
          )}

          {outcomes.length > 0 && (
            <Table
              columnDefinitions={[
                {
                  id: "name",
                  header: "성과명",
                  cell: (item) => item.name,
                },
                {
                  id: "metric",
                  header: "측정 지표",
                  cell: (item) => item.metric,
                },
                {
                  id: "target",
                  header: "목표치",
                  cell: (item) => item.target,
                },
                {
                  id: "timeframe",
                  header: "기한",
                  cell: (item) => item.timeframe,
                },
                {
                  id: "impact",
                  header: "영향도",
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
                  header: "작업",
                  cell: (item) => (
                    <Button
                      iconName="close"
                      variant="icon"
                      onClick={() => removeOutcome(item.id)}
                      ariaLabel="삭제"
                    />
                  ),
                },
              ]}
              items={outcomes}
              loadingText="Loading outcomes"
              empty={
                <Box textAlign="center" color="inherit">
                  <Box padding={{ bottom: "s" }} variant="p" color="inherit">
                    성과가 없습니다
                  </Box>
                </Box>
              }
            />
          )}
        </Container>

        {showReview && (
          <Container header={<Header variant="h2">성과 검토</Header>}>
            <SpaceBetween size="m">
              <div>
                <Box variant="awsui-key-label">문제 정의</Box>
                <Box>{problemStatement}</Box>
              </div>

              <Box variant="h4">비즈니스 성과 ({outcomes.length}개)</Box>
              <SpaceBetween size="s">
                {outcomes.map((outcome, index) => (
                  <Box key={outcome.id} padding={{ vertical: "xs" }}>
                    <Box variant="awsui-key-label">
                      성과 {index + 1}: {outcome.name}
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
                        <Box color="text-body-secondary">측정 지표</Box>
                        {outcome.metric}
                      </Box>
                      <Box fontSize="body-s">
                        <Box color="text-body-secondary">목표치</Box>
                        {outcome.target}
                      </Box>
                      <Box fontSize="body-s">
                        <Box color="text-body-secondary">기한</Box>
                        {outcome.timeframe}
                      </Box>
                      <Box fontSize="body-s">
                        <Box color="text-body-secondary">영향도</Box>
                        <Badge
                          color={
                            outcome.impact === "high"
                              ? "red"
                              : outcome.impact === "medium"
                              ? "blue"
                              : "grey"
                          }
                        >
                          {
                            impactOptions
                              .find((opt) => opt.value === outcome.impact)
                              ?.label.split(" - ")[0]
                          }
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
