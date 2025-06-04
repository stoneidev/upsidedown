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
  { value: "value-add", label: "가치 추가", color: "green" as const },
  { value: "non-value-add", label: "가치 미추가", color: "red" as const },
  {
    value: "necessary-non-value-add",
    label: "필수 가치 미추가",
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
          header: "AI 검토 의견",
          children: (
            <SpaceBetween size="m">
              <Alert type="info" header="가치 흐름 분석 완료">
                작성하신 가치 흐름을 분석했습니다.
              </Alert>

              <Header variant="h3">가치 흐름 분석</Header>
              <SpaceBetween size="xs">
                <StatusIndicator type="success">
                  총 {activities.length}개 활동 정의됨
                </StatusIndicator>
                <StatusIndicator type="info">
                  가치 추가 활동:{" "}
                  {activities.filter((a) => a.status === "value-add").length}개
                </StatusIndicator>
                <StatusIndicator type="warning">
                  필수 가치 미추가 활동:{" "}
                  {
                    activities.filter(
                      (a) => a.status === "necessary-non-value-add"
                    ).length
                  }
                  개
                </StatusIndicator>
                <StatusIndicator type="error">
                  가치 미추가 활동:{" "}
                  {
                    activities.filter((a) => a.status === "non-value-add")
                      .length
                  }
                  개
                </StatusIndicator>
              </SpaceBetween>

              <Header variant="h3">개선 제안</Header>
              <SpaceBetween size="xs">
                <div>• 가치 미추가 활동 최소화 또는 제거 검토</div>
                <div>• 리드 타임이 긴 활동에 대한 최적화 방안 검토</div>
                <div>• 주요 통증점에 대한 개선 아이디어 도출</div>
              </SpaceBetween>
            </SpaceBetween>
          ),
        });
      } else {
        setSplitPanel({
          header: "가치 흐름 작성 가이드",
          children: (
            <SpaceBetween size="m">
              <Header variant="h3">효과적인 가치 흐름 매핑</Header>
              <div>
                가치 흐름 매핑은 제품이나 서비스가 고객에게 전달되는 전체 과정을
                시각화하는 도구입니다.
              </div>
              <Header variant="h3">작성 팁</Header>
              <div>
                • 현재 상태(As-Is)를 정확히 기록하세요
                <br />
                • 각 활동의 리드 타임을 측정하세요
                <br />
                • 가치 추가 vs 가치 미추가 활동을 구분하세요
                <br />• 고객 관점에서 가치를 정의하세요
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
      header: "가치 흐름 식별 도움말",
      children: (
        <SpaceBetween size="m">
          <div>
            가치 흐름을 식별하고 각 활동의 가치 기여도를 평가하여 프로세스
            개선의 기회를 찾으세요.
          </div>
          <Header variant="h3">주요 용어</Header>
          <div>
            • 트리거: 가치 흐름의 시작점
            <br />
            • 활동: 프로세스의 각 단계
            <br />
            • 리드 타임: 각 활동에 소요되는 시간
            <br />
            • 가치 추가: 고객이 기꺼이 비용을 지불할 활동
            <br />• 통증점: 프로세스의 문제점이나 장애물
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
      newErrors.streamName = "가치 흐름 이름을 입력해주세요.";
    }

    if (!trigger.trim()) {
      newErrors.trigger = "트리거를 입력해주세요.";
    }

    if (!value.trim()) {
      newErrors.value = "가치를 입력해주세요.";
    }

    const hasEmptyActivity = activities.some((a) => !a.name.trim());
    if (hasEmptyActivity) {
      newErrors.activities = "모든 활동에 이름을 입력해주세요.";
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
          description="제품 또는 서비스 제공 과정의 가치 흐름을 식별하고 분석합니다"
        >
          가치 흐름 식별
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
            가치 흐름이 정의되었습니다. 필요시 편집하거나 다음 단계로 진행할 수
            있습니다.
          </Alert>
        )}

        <Container
          header={
            <Header
              variant="h2"
              description="가치 흐름의 기본 정보를 입력하세요"
            >
              기본 정보
            </Header>
          }
        >
          <SpaceBetween size="l">
            <FormField
              label="가치 흐름 이름"
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
                placeholder="예: 신규 고객 온보딩 프로세스"
              />
            </FormField>

            <FormField label="트리거" errorText={errors.trigger} stretch>
              <Input
                value={trigger}
                onChange={({ detail }) => {
                  setTrigger(detail.value);
                  setErrors({ ...errors, trigger: "" });
                  setIsReviewing(false);
                }}
                placeholder="예: 회원가입 버튼 클릭"
              />
            </FormField>

            <FormField label="가치" errorText={errors.value} stretch>
              <Textarea
                value={value}
                onChange={({ detail }) => {
                  setValue(detail.value);
                  setErrors({ ...errors, value: "" });
                  setIsReviewing(false);
                }}
                placeholder="예: 신규 사용자가 제품의 핵심 기능을 경험하고 지속적으로 사용하게 함"
                rows={3}
              />
            </FormField>
          </SpaceBetween>
        </Container>

        <Container
          header={
            <Header
              variant="h2"
              description="가치 흐름 내 활동을 정의하고 분석하세요"
              actions={
                <Button iconName="add-plus" onClick={addActivity}>
                  활동 추가
                </Button>
              }
            >
              활동
            </Header>
          }
        >
          {errors.activities && (
            <Alert type="error" header="오류">
              {errors.activities}
            </Alert>
          )}

          <Cards
            cardDefinition={{
              header: (item) => (
                <SpaceBetween size="xs" direction="horizontal">
                  <Icon name="arrow-right" />
                  <div>{item.name || `활동 ${item.id}`}</div>
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
                  header: "상세 정보",
                  content: (item) => (
                    <SpaceBetween size="l">
                      <FormField label="활동명">
                        <Input
                          value={item.name}
                          onChange={({ detail }) =>
                            updateActivity(item.id, "name", detail.value)
                          }
                          placeholder="활동명 입력"
                        />
                      </FormField>

                      <FormField label="설명">
                        <Textarea
                          value={item.description}
                          onChange={({ detail }) =>
                            updateActivity(item.id, "description", detail.value)
                          }
                          placeholder="활동에 대한 설명"
                          rows={2}
                        />
                      </FormField>

                      <ColumnLayout columns={2}>
                        <FormField label="리드 타임">
                          <Input
                            value={item.leadTime}
                            onChange={({ detail }) =>
                              updateActivity(item.id, "leadTime", detail.value)
                            }
                            placeholder="예: 2시간, 3일"
                          />
                        </FormField>

                        <FormField label="상태">
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

                      <FormField label="통증점">
                        <Textarea
                          value={item.painPoint}
                          onChange={({ detail }) =>
                            updateActivity(item.id, "painPoint", detail.value)
                          }
                          placeholder="이 활동의 문제점이나 장애물"
                          rows={2}
                        />
                      </FormField>

                      <Button
                        iconName="close"
                        variant="link"
                        disabled={activities.length === 1}
                        onClick={() => removeActivity(item.id)}
                      >
                        활동 제거
                      </Button>
                    </SpaceBetween>
                  ),
                },
              ],
            }}
            cardsPerRow={[{ cards: 1 }, { minWidth: 500, cards: 2 }]}
            items={activities}
            loadingText="로딩 중"
            empty="활동이 없습니다"
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

                {/* 화살표 */}
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
                  // 활동명의 이니셜 또는 첫 글자 추출
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
                          : `활동 ${index + 1}`}
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
            검토
          </Button>
          <Button variant="primary" iconAlign="right" iconName="check">
            저장
          </Button>
        </SpaceBetween>
      </SpaceBetween>
    </ContentLayout>
  );
}
