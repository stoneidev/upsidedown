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
} from "@cloudscape-design/components";
import { useAppLayout } from "@/app/context/AppLayoutContext";
import { useRouter } from "next/navigation";

interface KeyResult {
  id: string;
  value: string;
}

export default function BusinessGoalAlignment() {
  const { setSplitPanel, setHelpPanel } = useAppLayout();
  const router = useRouter();

  const [customer, setCustomer] = useState("");
  const [objective, setObjective] = useState("");
  const [keyResults, setKeyResults] = useState<KeyResult[]>([
    { id: "1", value: "" },
  ]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showReview, setShowReview] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);

  const updateSplitPanel = useCallback(
    (reviewing: boolean) => {
      if (
        reviewing &&
        customer &&
        objective &&
        keyResults.some((kr) => kr.value)
      ) {
        setSplitPanel({
          header: "AI 검토 의견",
          children: (
            <SpaceBetween size="m">
              <Alert type="info" header="OKR 분석 완료">
                작성하신 OKR을 분석했습니다. 아래 피드백을 참고하여
                개선해보세요.
              </Alert>

              <Box variant="h4">타겟 고객 분석</Box>
              <Box variant="p">
                {'"'}
                {customer}
                {'"'}는 구체적으로 정의되었습니다.
                <Box variant="span" color="text-status-error" fontWeight="bold">
                  {" "}
                  단, 고객의 규모나 산업군을 더 구체화하면 좋겠습니다.
                </Box>
              </Box>

              <Box variant="h4">Objective 분석</Box>
              <Box variant="p">
                현재 목표는 측정 가능한 요소가 포함되어 있습니다.
                <StatusIndicator type="success">Good</StatusIndicator>
              </Box>
              <Box variant="p">
                <Box variant="span" color="text-status-error" fontWeight="bold">
                  개선 제안: 시간 프레임(예: 2024년 상반기)을 명시하면 더욱
                  명확해집니다.
                </Box>
              </Box>

              <Box variant="h4">Key Results 분석</Box>
              <SpaceBetween size="xs">
                {keyResults
                  .filter((kr) => kr.value)
                  .map((kr, index) => (
                    <Box key={kr.id}>
                      <Badge color="blue">KR{index + 1}</Badge>{" "}
                      {kr.value.includes("%") || kr.value.match(/\d+/) ? (
                        <StatusIndicator type="success">
                          측정 가능
                        </StatusIndicator>
                      ) : (
                        <Box
                          variant="span"
                          color="text-status-error"
                          fontWeight="bold"
                        >
                          구체적인 수치 추가 필요
                        </Box>
                      )}
                    </Box>
                  ))}
              </SpaceBetween>

              <Box variant="h4">종합 점수</Box>
              <Box fontSize="heading-l" fontWeight="bold">
                85/100
              </Box>
              <Box variant="p" color="text-body-secondary">
                전반적으로 잘 작성되었으나,
                <Box variant="span" color="text-status-error" fontWeight="bold">
                  {" "}
                  측정 지표의 구체성과 시간 프레임
                </Box>
                을 보완하면 완벽합니다.
              </Box>

              <Box variant="h4">추천 액션</Box>
              <SpaceBetween size="xs">
                <Box>• 각 KR에 구체적인 달성 기한 추가</Box>
                <Box>• 현재 상태(baseline) 명시</Box>
                <Box>• 측정 방법 및 담당자 지정 고려</Box>
              </SpaceBetween>
            </SpaceBetween>
          ),
        });
      } else {
        setSplitPanel({
          header: "OKR 작성 가이드",
          children: (
            <SpaceBetween size="m">
              <Box variant="h4">좋은 OKR 작성법</Box>
              <Box variant="p">
                <strong>Objective (목표)</strong>는 영감을 주고 달성 가능한
                정성적 목표여야 합니다.
              </Box>
              <Box variant="p">
                <strong>Key Results (핵심 결과)</strong>는 측정 가능한 정량적
                지표여야 합니다.
              </Box>
              <Box variant="small">
                예시: {'"'}고객 만족도 점수를 4.5점 이상으로 향상{'"'}
              </Box>
            </SpaceBetween>
          ),
        });
      }
    },
    [setSplitPanel, customer, objective, keyResults]
  );

  useEffect(() => {
    updateSplitPanel(isReviewing);

    setHelpPanel({
      header: "Business Goal Alignment",
      children: (
        <SpaceBetween size="m">
          <Box variant="p">
            비즈니스 목표를 명확히 정의하고 측정 가능한 결과를 설정하세요.
          </Box>
          <Box variant="h4">도움말</Box>
          <Box variant="p">
            • 타겟 고객을 구체적으로 정의하세요
            <br />
            • Objective는 3-6개월 내 달성 가능해야 합니다
            <br />• Key Results는 3-5개가 적절합니다
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
    customer,
    objective,
    keyResults,
    updateSplitPanel,
  ]);

  const addKeyResult = () => {
    const newId = (keyResults.length + 1).toString();
    setKeyResults([...keyResults, { id: newId, value: "" }]);
  };

  const removeKeyResult = (id: string) => {
    if (keyResults.length > 1) {
      setKeyResults(keyResults.filter((kr) => kr.id !== id));
    }
  };

  const updateKeyResult = (id: string, value: string) => {
    setKeyResults(
      keyResults.map((kr) => (kr.id === id ? { ...kr, value } : kr))
    );
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!customer.trim()) {
      newErrors.customer = "타겟 고객을 입력해주세요.";
    }

    if (!objective.trim()) {
      newErrors.objective = "Objective를 입력해주세요.";
    }

    const hasEmptyKR = keyResults.some((kr) => !kr.value.trim());
    if (hasEmptyKR) {
      newErrors.keyResults = "모든 Key Result를 입력해주세요.";
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
      // 다음 페이지로 이동
      router.push("/product-team/identify/customer-experience-map");
    }
  };

  return (
    <ContentLayout
      header={
        <Header
          variant="h1"
          description="타겟 고객을 정의하고 최상위 OKR을 작성합니다"
        >
          Business Goal Alignment
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
            OKR이 올바르게 작성되었습니다. 다음 단계로 진행할 수 있습니다.
          </Alert>
        )}

        <Container
          header={
            <Header
              variant="h2"
              description="제품의 주요 타겟 고객을 구체적으로 정의하세요"
            >
              타겟 고객 정의
            </Header>
          }
        >
          <FormField
            label="타겟 고객"
            description="누가 이 제품의 주요 사용자인가요?"
            errorText={errors.customer}
            stretch
          >
            <Input
              value={customer}
              onChange={({ detail }) => {
                setCustomer(detail.value);
                setErrors({ ...errors, customer: "" });
                setIsReviewing(false);
              }}
              placeholder="예: 중소기업의 프로덕트 매니저"
            />
          </FormField>
        </Container>

        <Container
          header={
            <Header
              variant="h2"
              description="타겟 고객을 위한 최상위 목표와 측정 가능한 결과를 설정하세요"
            >
              OKR 설정
            </Header>
          }
        >
          <SpaceBetween size="l">
            <FormField
              label="Objective (목표)"
              description="달성하고자 하는 정성적 목표를 작성하세요"
              errorText={errors.objective}
              stretch
            >
              <Textarea
                value={objective}
                onChange={({ detail }) => {
                  setObjective(detail.value);
                  setErrors({ ...errors, objective: "" });
                  setIsReviewing(false);
                }}
                placeholder="예: 고객이 제품 개발 프로세스를 체계적으로 관리할 수 있도록 돕는다"
                rows={3}
              />
            </FormField>

            <FormField
              label="Key Results (핵심 결과)"
              description="목표 달성 여부를 측정할 수 있는 정량적 지표를 작성하세요"
              errorText={errors.keyResults}
              stretch
            >
              <SpaceBetween size="s">
                {keyResults.map((kr, index) => (
                  <Grid
                    key={kr.id}
                    gridDefinition={[
                      { colspan: { default: 11 } },
                      { colspan: { default: 1 } },
                    ]}
                  >
                    <Input
                      value={kr.value}
                      onChange={({ detail }) => {
                        updateKeyResult(kr.id, detail.value);
                        setErrors({ ...errors, keyResults: "" });
                        setIsReviewing(false);
                      }}
                      placeholder={`Key Result ${
                        index + 1
                      } 예: 제품 출시 기간 40% 단축`}
                    />
                    <Button
                      iconName="close"
                      variant="icon"
                      disabled={keyResults.length === 1}
                      onClick={() => removeKeyResult(kr.id)}
                      ariaLabel={`Key Result ${index + 1} 삭제`}
                    />
                  </Grid>
                ))}

                <Button
                  iconName="add-plus"
                  onClick={addKeyResult}
                  disabled={keyResults.length >= 5}
                >
                  Key Result 추가
                </Button>
              </SpaceBetween>
            </FormField>
          </SpaceBetween>
        </Container>

        {showReview && (
          <Container header={<Header variant="h2">OKR 검토</Header>}>
            <ColumnLayout columns={2} variant="text-grid">
              <div>
                <Box variant="awsui-key-label">타겟 고객</Box>
                <Box>{customer}</Box>
              </div>
              <div>
                <Box variant="awsui-key-label">Objective</Box>
                <Box>{objective}</Box>
              </div>
            </ColumnLayout>

            <Box margin={{ top: "m" }}>
              <Box variant="awsui-key-label">Key Results</Box>
              <SpaceBetween size="xs">
                {keyResults
                  .filter((kr) => kr.value)
                  .map((kr, index) => (
                    <Box key={kr.id}>
                      {index + 1}. {kr.value}
                    </Box>
                  ))}
              </SpaceBetween>
            </Box>
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
