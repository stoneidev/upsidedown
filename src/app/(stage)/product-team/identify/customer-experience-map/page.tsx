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
  { label: "매우 만족 😊", value: "very-satisfied" },
  { label: "만족 🙂", value: "satisfied" },
  { label: "보통 😐", value: "neutral" },
  { label: "불만족 😕", value: "unsatisfied" },
  { label: "매우 불만족 😞", value: "very-unsatisfied" },
];

export default function CustomerExperienceMap() {
  const { setSplitPanel, setHelpPanel } = useAppLayout();
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
          header: "AI 검토 의견",
          children: (
            <SpaceBetween size="m">
              <Alert type="info" header="고객 경험 맵 분석 완료">
                작성하신 고객 경험 맵을 분석했습니다. 아래 피드백을 참고하여
                개선해보세요.
              </Alert>

              <Box variant="h4">페르소나 분석</Box>
              <Box variant="p">
                페르소나가 명확하게 정의되었습니다.
                <StatusIndicator type="success">Good</StatusIndicator>
              </Box>

              <Box variant="h4">고객 여정 분석</Box>
              <Box variant="p">
                {journeyStages.length}개의 단계로 구성된 여정입니다.
                <Box variant="span" color="text-status-error" fontWeight="bold">
                  {" "}
                  일반적으로 5-7개 단계가 적절합니다.
                </Box>
              </Box>

              <Box variant="h4">페인포인트 분석</Box>
              <SpaceBetween size="xs">
                {journeyStages
                  .filter((js) => js.painPoints)
                  .map((js, index) => (
                    <Box key={js.id}>
                      <Badge color="red">단계 {index + 1}</Badge>{" "}
                      {js.painPoints ? (
                        <StatusIndicator type="warning">
                          개선 기회 발견
                        </StatusIndicator>
                      ) : (
                        <Box
                          variant="span"
                          color="text-status-error"
                          fontWeight="bold"
                        >
                          페인포인트 미작성
                        </Box>
                      )}
                    </Box>
                  ))}
              </SpaceBetween>

              <Box variant="h4">개선 제안</Box>
              <SpaceBetween size="xs">
                <Box>• 각 단계별 감정 변화를 더 구체적으로 기록</Box>
                <Box>• 터치포인트와 페인포인트의 연관성 분석</Box>
                <Box>• 개선 기회가 가장 큰 단계 우선순위 설정</Box>
              </SpaceBetween>
            </SpaceBetween>
          ),
        });
      } else {
        setSplitPanel({
          header: "고객 경험 맵 작성 가이드",
          children: (
            <SpaceBetween size="m">
              <Box variant="h4">효과적인 고객 경험 맵</Box>
              <Box variant="p">
                고객의 전체 여정을 시각화하여 개선 기회를 발견하세요.
              </Box>
              <Box variant="h4">작성 팁</Box>
              <Box variant="p">
                • 실제 고객 인터뷰나 관찰을 기반으로 작성
                <br />
                • 각 단계별 감정 변화에 주목
                <br />• 페인포인트는 구체적으로 기술
              </Box>
            </SpaceBetween>
          ),
        });
      }
    },
    [setSplitPanel, persona, scenario, journeyStages]
  );

  useEffect(() => {
    updateSplitPanel(isReviewing);

    setHelpPanel({
      header: "Customer Experience Map",
      children: (
        <SpaceBetween size="m">
          <Box variant="p">
            고객의 여정을 단계별로 매핑하여 개선 기회를 발견하세요.
          </Box>
          <Box variant="h4">구성 요소</Box>
          <Box variant="p">
            • 단계: 고객이 거치는 주요 단계
            <br />
            • 행동: 각 단계에서의 구체적 행동
            <br />
            • 생각: 고객의 내면적 생각
            <br />
            • 감정: 각 단계의 감정 상태
            <br />
            • 터치포인트: 고객과의 접점
            <br />• 페인포인트: 불편사항 및 문제점
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
      newErrors.persona = "페르소나를 입력해주세요.";
    }

    if (!scenario.trim()) {
      newErrors.scenario = "시나리오를 입력해주세요.";
    }

    const hasEmptyStage = journeyStages.some((js) => !js.stage.trim());
    if (hasEmptyStage) {
      newErrors.journeyStages = "모든 단계 이름을 입력해주세요.";
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
          description="고객의 여정을 시각화하여 개선 기회를 발견합니다"
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
            header="검토 완료"
          >
            고객 경험 맵이 작성되었습니다. 다음 단계로 진행할 수 있습니다.
          </Alert>
        )}

        <Container
          header={
            <Header
              variant="h2"
              description="고객 페르소나와 시나리오를 정의하세요"
            >
              기본 정보
            </Header>
          }
        >
          <SpaceBetween size="l">
            <FormField
              label="페르소나"
              description="대표 고객의 특성을 구체적으로 정의하세요"
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
                placeholder="예: 30대 중반 프로덕트 매니저, 5년차, 애자일 경험 있음"
              />
            </FormField>

            <FormField
              label="시나리오"
              description="고객이 겪는 구체적인 상황을 설명하세요"
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
                placeholder="예: 새로운 제품 기능을 기획하고 개발팀과 협업하는 과정"
                rows={3}
              />
            </FormField>
          </SpaceBetween>
        </Container>

        <Container
          header={
            <Header
              variant="h2"
              description="고객 여정의 각 단계를 상세히 매핑하세요"
              actions={
                <Button
                  iconName="add-plus"
                  onClick={addJourneyStage}
                  disabled={journeyStages.length >= 10}
                >
                  단계 추가
                </Button>
              }
            >
              고객 여정 단계
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
                        ariaLabel={`단계 ${index + 1} 삭제`}
                      />
                    }
                  >
                    단계 {index + 1}
                  </Header>
                }
              >
                <ColumnLayout columns={2}>
                  <FormField
                    label="단계 이름"
                    errorText={
                      errors.journeyStages && !js.stage ? "필수 입력" : ""
                    }
                  >
                    <Input
                      value={js.stage}
                      onChange={({ detail }) => {
                        updateJourneyStage(js.id, "stage", detail.value);
                        setErrors({ ...errors, journeyStages: "" });
                        setIsReviewing(false);
                      }}
                      placeholder="예: 문제 인식"
                    />
                  </FormField>

                  <FormField label="감정 상태">
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
                      placeholder="감정 선택"
                    />
                  </FormField>

                  <FormField label="행동">
                    <Textarea
                      value={js.actions}
                      onChange={({ detail }) => {
                        updateJourneyStage(js.id, "actions", detail.value);
                        setIsReviewing(false);
                      }}
                      placeholder="이 단계에서 고객이 하는 행동"
                      rows={2}
                    />
                  </FormField>

                  <FormField label="생각">
                    <Textarea
                      value={js.thoughts}
                      onChange={({ detail }) => {
                        updateJourneyStage(js.id, "thoughts", detail.value);
                        setIsReviewing(false);
                      }}
                      placeholder="고객의 내면적 생각"
                      rows={2}
                    />
                  </FormField>

                  <FormField label="터치포인트">
                    <Textarea
                      value={js.touchpoints}
                      onChange={({ detail }) => {
                        updateJourneyStage(js.id, "touchpoints", detail.value);
                        setIsReviewing(false);
                      }}
                      placeholder="고객과의 접점 (웹사이트, 이메일 등)"
                      rows={2}
                    />
                  </FormField>

                  <FormField label="페인포인트">
                    <Textarea
                      value={js.painPoints}
                      onChange={({ detail }) => {
                        updateJourneyStage(js.id, "painPoints", detail.value);
                        setIsReviewing(false);
                      }}
                      placeholder="불편하거나 개선이 필요한 부분"
                      rows={2}
                    />
                  </FormField>
                </ColumnLayout>
              </Container>
            ))}
          </SpaceBetween>
        </Container>

        {showReview && (
          <Container header={<Header variant="h2">고객 경험 맵 검토</Header>}>
            <SpaceBetween size="m">
              <ColumnLayout columns={2} variant="text-grid">
                <div>
                  <Box variant="awsui-key-label">페르소나</Box>
                  <Box>{persona}</Box>
                </div>
                <div>
                  <Box variant="awsui-key-label">시나리오</Box>
                  <Box>{scenario}</Box>
                </div>
              </ColumnLayout>

              <Box variant="h4">고객 여정</Box>
              {journeyStages
                .filter((js) => js.stage)
                .map((js, index) => (
                  <Box key={js.id} padding={{ vertical: "xs" }}>
                    <Box variant="awsui-key-label">
                      단계 {index + 1}: {js.stage}
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
                        <Box color="text-body-secondary">감정</Box>
                        {emotionOptions.find((opt) => opt.value === js.emotions)
                          ?.label || "-"}
                      </Box>
                      <Box fontSize="body-s">
                        <Box color="text-body-secondary">행동</Box>
                        {js.actions || "-"}
                      </Box>
                      <Box fontSize="body-s">
                        <Box color="text-body-secondary">터치포인트</Box>
                        {js.touchpoints || "-"}
                      </Box>
                      <Box fontSize="body-s">
                        <Box color="text-body-secondary">페인포인트</Box>
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
