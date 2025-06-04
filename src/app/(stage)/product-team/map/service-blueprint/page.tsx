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
  Cards,
  Icon,
} from "@cloudscape-design/components";
import { useAppLayout } from "@/app/context/AppLayoutContext";
import { useRouter } from "next/navigation";

interface ServiceLayer {
  id: string;
  type:
    | "physical-evidence"
    | "customer-actions"
    | "frontstage"
    | "backstage"
    | "support";
  elements: string[];
}

type BadgeColor = "blue" | "green" | "grey" | "red" | "severity-neutral";

type LayerType = {
  name: string;
  icon:
    | "view-full"
    | "user-profile"
    | "contact"
    | "settings"
    | "status-positive";
  color: BadgeColor;
};

const layerTypes: Record<ServiceLayer["type"], LayerType> = {
  "physical-evidence": {
    name: "물리적 증거",
    icon: "view-full",
    color: "blue",
  },
  "customer-actions": {
    name: "고객 행동",
    icon: "user-profile",
    color: "green",
  },
  frontstage: {
    name: "프론트스테이지",
    icon: "contact",
    color: "severity-neutral",
  },
  backstage: { name: "백스테이지", icon: "settings", color: "grey" },
  support: { name: "지원 프로세스", icon: "status-positive", color: "red" },
};

export default function ServiceBlueprint() {
  const { setSplitPanel, setHelpPanel, setSplitPanelOpen } = useAppLayout();
  const router = useRouter();

  const [serviceName, setServiceName] = useState("");
  const [serviceDescription, setServiceDescription] = useState("");
  const [layers, setLayers] = useState<ServiceLayer[]>([
    { id: "1", type: "physical-evidence", elements: [] },
    { id: "2", type: "customer-actions", elements: [] },
    { id: "3", type: "frontstage", elements: [] },
    { id: "4", type: "backstage", elements: [] },
    { id: "5", type: "support", elements: [] },
  ]);
  const [inputValues, setInputValues] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showReview, setShowReview] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);

  const updateSplitPanel = useCallback(
    (reviewing: boolean) => {
      if (
        reviewing &&
        serviceName &&
        layers.some((l) => l.elements.length > 0)
      ) {
        setSplitPanel({
          header: "AI 검토 의견",
          children: (
            <SpaceBetween size="m">
              <Alert type="info" header="서비스 블루프린트 분석 완료">
                작성하신 서비스 블루프린트를 분석했습니다.
              </Alert>

              <Box variant="h4">서비스 구조 분석</Box>
              <SpaceBetween size="xs">
                {layers.map((layer) => (
                  <Box key={layer.id}>
                    <Badge color={layerTypes[layer.type].color}>
                      {layerTypes[layer.type].name}
                    </Badge>{" "}
                    {layer.elements.length > 0 ? (
                      <StatusIndicator type="success">
                        {layer.elements.length}개 요소
                      </StatusIndicator>
                    ) : (
                      <Box
                        variant="span"
                        color="text-status-error"
                        fontWeight="bold"
                      >
                        요소 없음
                      </Box>
                    )}
                  </Box>
                ))}
              </SpaceBetween>

              <Box variant="h4">개선 포인트</Box>
              <Box variant="p">
                <Box variant="span" color="text-status-error" fontWeight="bold">
                  가시선(Line of Visibility)과 상호작용선(Line of Interaction)을
                  명확히 구분하여 각 레이어 간 관계를 더 명확히 하세요.
                </Box>
              </Box>

              <Box variant="h4">추천 사항</Box>
              <SpaceBetween size="xs">
                <Box>• 각 터치포인트별 소요 시간 추가</Box>
                <Box>• 실패 지점(Fail Points) 식별 및 대응 방안 수립</Box>
                <Box>• 고객 만족도에 영향을 미치는 핵심 순간 표시</Box>
              </SpaceBetween>
            </SpaceBetween>
          ),
        });
      } else {
        setSplitPanel({
          header: "서비스 블루프린트 작성 가이드",
          children: (
            <SpaceBetween size="m">
              <Box variant="h4">서비스 블루프린트란?</Box>
              <Box variant="p">
                서비스의 전체 프로세스를 시각화하여 고객 경험과 내부 운영을
                연결합니다.
              </Box>
              <Box variant="h4">주요 레이어</Box>
              <Box variant="p">
                • 물리적 증거: 고객이 보고 만지는 것<br />
                • 고객 행동: 고객이 하는 활동
                <br />
                • 프론트스테이지: 고객이 보는 직원 활동
                <br />
                • 백스테이지: 고객이 보지 못하는 직원 활동
                <br />• 지원 프로세스: 서비스를 가능하게 하는 시스템
              </Box>
            </SpaceBetween>
          ),
        });
      }
    },
    [setSplitPanel, serviceName, layers]
  );

  useEffect(() => {
    setSplitPanelOpen(false);
    updateSplitPanel(isReviewing);

    setHelpPanel({
      header: "Service Blueprint",
      children: (
        <SpaceBetween size="m">
          <Box variant="p">
            서비스의 모든 구성 요소와 프로세스를 체계적으로 매핑하세요.
          </Box>
          <Box variant="h4">작성 팁</Box>
          <Box variant="p">
            • 시간 순서대로 왼쪽에서 오른쪽으로 작성
            <br />
            • 각 레이어는 가시선으로 구분
            <br />
            • 상호작용 포인트를 명확히 표시
            <br />• 백스테이지와 지원 프로세스 연결 표시
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
    serviceName,
    layers,
    updateSplitPanel,
  ]);

  const addElement = (layerId: string, element: string) => {
    if (element.trim()) {
      setLayers(
        layers.map((layer) =>
          layer.id === layerId
            ? { ...layer, elements: [...layer.elements, element] }
            : layer
        )
      );
      setInputValues({ ...inputValues, [layerId]: "" });
    }
  };

  const removeElement = (layerId: string, index: number) => {
    setLayers(
      layers.map((layer) =>
        layer.id === layerId
          ? { ...layer, elements: layer.elements.filter((_, i) => i !== index) }
          : layer
      )
    );
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!serviceName.trim()) {
      newErrors.serviceName = "서비스명을 입력해주세요.";
    }

    if (!serviceDescription.trim()) {
      newErrors.serviceDescription = "서비스 설명을 입력해주세요.";
    }

    const hasNoElements = layers.every((layer) => layer.elements.length === 0);
    if (hasNoElements) {
      newErrors.layers = "최소 하나 이상의 레이어에 요소를 추가해주세요.";
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
      router.push("/product-team/map/value-stream-identify");
    }
  };

  return (
    <ContentLayout
      header={
        <Header
          variant="h1"
          description="서비스의 전체 프로세스를 시각화하고 개선 기회를 찾습니다"
        >
          Service Blueprint
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
            서비스 블루프린트가 작성되었습니다. 다음 단계로 진행할 수 있습니다.
          </Alert>
        )}

        <Container
          header={
            <Header
              variant="h2"
              description="분석할 서비스의 기본 정보를 입력하세요"
            >
              서비스 정보
            </Header>
          }
        >
          <SpaceBetween size="l">
            <FormField label="서비스명" errorText={errors.serviceName} stretch>
              <Input
                value={serviceName}
                onChange={({ detail }) => {
                  setServiceName(detail.value);
                  setErrors({ ...errors, serviceName: "" });
                  setIsReviewing(false);
                }}
                placeholder="예: 온라인 제품 주문 서비스"
              />
            </FormField>

            <FormField
              label="서비스 설명"
              description="서비스의 목적과 주요 기능을 설명하세요"
              errorText={errors.serviceDescription}
              stretch
            >
              <Textarea
                value={serviceDescription}
                onChange={({ detail }) => {
                  setServiceDescription(detail.value);
                  setErrors({ ...errors, serviceDescription: "" });
                  setIsReviewing(false);
                }}
                placeholder="예: 고객이 온라인으로 제품을 검색, 선택, 주문하고 배송받는 전체 프로세스"
                rows={3}
              />
            </FormField>
          </SpaceBetween>
        </Container>

        <Container
          header={
            <Header
              variant="h2"
              description="각 레이어별 구성 요소를 추가하세요"
            >
              서비스 레이어
            </Header>
          }
        >
          {errors.layers && (
            <Alert type="error" header="오류">
              {errors.layers}
            </Alert>
          )}

          <Cards
            cardDefinition={{
              header: (item) => (
                <SpaceBetween size="xs" direction="horizontal">
                  <Icon name={layerTypes[item.type].icon} />
                  <Box fontWeight="bold">{layerTypes[item.type].name}</Box>
                </SpaceBetween>
              ),
              sections: [
                {
                  content: (item) => (
                    <SpaceBetween size="s">
                      <FormField label="요소 추가">
                        <SpaceBetween size="xs" direction="horizontal">
                          <Input
                            value={inputValues[item.id] || ""}
                            onChange={({ detail }) => {
                              setInputValues({
                                ...inputValues,
                                [item.id]: detail.value,
                              });
                            }}
                            placeholder={`${
                              layerTypes[item.type].name
                            } 요소 입력`}
                            onKeyDown={(e) => {
                              if (e.detail.key === "Enter") {
                                addElement(item.id, inputValues[item.id] || "");
                                setErrors({ ...errors, layers: "" });
                                setIsReviewing(false);
                              }
                            }}
                          />
                          <Button
                            iconName="add-plus"
                            variant="icon"
                            onClick={() => {
                              addElement(item.id, inputValues[item.id] || "");
                              setErrors({ ...errors, layers: "" });
                              setIsReviewing(false);
                            }}
                          />
                        </SpaceBetween>
                      </FormField>

                      {item.elements.length > 0 && (
                        <SpaceBetween size="xs">
                          {item.elements.map((element, index) => (
                            <Box key={index}>
                              <SpaceBetween size="xs" direction="horizontal">
                                <Badge color={layerTypes[item.type].color}>
                                  {element}
                                </Badge>
                                <Button
                                  iconName="close"
                                  variant="icon"
                                  onClick={() => removeElement(item.id, index)}
                                  ariaLabel={`${element} 삭제`}
                                />
                              </SpaceBetween>
                            </Box>
                          ))}
                        </SpaceBetween>
                      )}
                    </SpaceBetween>
                  ),
                },
              ],
            }}
            cardsPerRow={[{ cards: 1 }, { minWidth: 500, cards: 2 }]}
            items={layers}
            loadingText="Loading"
            empty="No layers"
          />
        </Container>

        {showReview && (
          <Container
            header={<Header variant="h2">서비스 블루프린트 검토</Header>}
          >
            <SpaceBetween size="m">
              <ColumnLayout columns={2} variant="text-grid">
                <div>
                  <Box variant="awsui-key-label">서비스명</Box>
                  <Box>{serviceName}</Box>
                </div>
                <div>
                  <Box variant="awsui-key-label">서비스 설명</Box>
                  <Box>{serviceDescription}</Box>
                </div>
              </ColumnLayout>

              <Box variant="h4">서비스 레이어</Box>
              <SpaceBetween size="s">
                {layers
                  .filter((layer) => layer.elements.length > 0)
                  .map((layer) => (
                    <Box key={layer.id}>
                      <Box variant="awsui-key-label" margin={{ bottom: "xs" }}>
                        <Icon name={layerTypes[layer.type].icon} />{" "}
                        {layerTypes[layer.type].name}
                      </Box>
                      <SpaceBetween size="xs" direction="horizontal">
                        {layer.elements.map((element, index) => (
                          <Badge
                            key={index}
                            color={layerTypes[layer.type].color}
                          >
                            {element}
                          </Badge>
                        ))}
                      </SpaceBetween>
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
