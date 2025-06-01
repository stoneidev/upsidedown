"use client";

import * as React from "react";
import Image from "next/image";
import ContentLayout from "@cloudscape-design/components/content-layout";
import Container from "@cloudscape-design/components/container";
import Header from "@cloudscape-design/components/header";
import SpaceBetween from "@cloudscape-design/components/space-between";
import Button from "@cloudscape-design/components/button";
import Box from "@cloudscape-design/components/box";
import Grid from "@cloudscape-design/components/grid";
import ColumnLayout from "@cloudscape-design/components/column-layout";
import TextContent from "@cloudscape-design/components/text-content";
import Badge from "@cloudscape-design/components/badge";
import Icon from "@cloudscape-design/components/icon";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();

  return (
    <ContentLayout
      defaultPadding
      header={
        <SpaceBetween size="m">
          <Header
            variant="h1"
            description="차세대 제품 개발 프로세스 관리 플랫폼"
            actions={
              <SpaceBetween size="xs" direction="horizontal">
                <Button onClick={() => router.push("/login")}>로그인</Button>
                <Button
                  variant="primary"
                  onClick={() =>
                    router.push(
                      "/product-team/identify/business-goal-alignment"
                    )
                  }
                >
                  무료로 시작하기
                </Button>
              </SpaceBetween>
            }
          >
            <Box fontSize="heading-xl" fontWeight="heavy">
              UpsideDown
            </Box>
          </Header>
        </SpaceBetween>
      }
    >
      <SpaceBetween size="l">
        {/* Hero Section with Image */}
        <Container>
          <div
            style={{
              position: "relative",
              overflow: "hidden",
              borderRadius: "8px",
            }}
          >
            <Image
              src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2940&auto=format&fit=crop"
              alt="Team collaboration"
              width={2940}
              height={400}
              style={{
                width: "100%",
                height: "400px",
                objectFit: "cover",
                opacity: 0.9,
              }}
            />
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "100%",
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                borderRadius: "8px",
                maxWidth: "800px",
              }}
            >
              <Box
                textAlign="center"
                padding={{ vertical: "xl", horizontal: "l" }}
              >
                <SpaceBetween size="l">
                  <Box fontSize="display-l" fontWeight="light">
                    제품 개발의 모든 단계를{" "}
                    <Box variant="strong">체계적으로</Box> 관리하세요
                  </Box>
                  <TextContent>
                    <p>
                      비즈니스 목표 정렬부터 개발 사이클까지, 모든 팀이 하나의
                      플랫폼에서 협업하며 혁신적인 제품을 만들어갑니다.
                    </p>
                  </TextContent>
                  <Box>
                    <Button
                      variant="primary"
                      iconName="external"
                      onClick={() =>
                        router.push(
                          "/product-team/identify/business-goal-alignment"
                        )
                      }
                    >
                      30일 무료 체험 시작하기
                    </Button>
                  </Box>
                </SpaceBetween>
              </Box>
            </div>
          </div>
        </Container>

        {/* Key Features */}
        <Container
          header={
            <Header
              variant="h2"
              description="팀의 생산성을 극대화하는 핵심 기능"
            >
              주요 기능
            </Header>
          }
        >
          <ColumnLayout columns={3} variant="text-grid">
            <div>
              <SpaceBetween size="xs">
                <Box variant="h3">
                  <Icon name="search" /> 고객 중심 발견
                </Box>
                <Box variant="p">
                  Customer Journey Map, 고객 경험 지도, 가치 흐름 식별 등 고객의
                  진짜 니즈를 발견하는 도구들
                </Box>
              </SpaceBetween>
            </div>
            <div>
              <SpaceBetween size="xs">
                <Box variant="h3">
                  <Icon name="settings" /> 체계적인 설계
                </Box>
                <Box variant="p">
                  가설 구축, 프로토타이핑, 측정 지표 설정까지 데이터 기반의 제품
                  설계 프로세스
                </Box>
              </SpaceBetween>
            </div>
            <div>
              <SpaceBetween size="xs">
                <Box variant="h3">
                  <Icon name="status-positive" /> 애자일 개발
                </Box>
                <Box variant="p">
                  Event Storming, Story Workshop, LRP 등 최신 애자일 방법론 통합
                  지원
                </Box>
              </SpaceBetween>
            </div>
          </ColumnLayout>
        </Container>

        {/* Visual Section with Statistics */}
        <Grid
          gridDefinition={[
            { colspan: { default: 12, s: 6 } },
            { colspan: { default: 12, s: 6 } },
          ]}
        >
          <Container>
            <Image
              src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop"
              alt="Data analytics dashboard"
              width={2426}
              height={300}
              style={{
                width: "100%",
                height: "300px",
                objectFit: "cover",
                borderRadius: "8px",
              }}
            />
          </Container>
          <Container
            header={<Header variant="h2">데이터 기반 의사결정</Header>}
          >
            <SpaceBetween size="m">
              <TextContent>
                <p>
                  실시간 대시보드와 분석 도구로 제품의 성과를 측정하고, 데이터에
                  기반한 빠른 의사결정을 내릴 수 있습니다.
                </p>
                <ul>
                  <li>실시간 KPI 모니터링</li>
                  <li>커스터마이징 가능한 대시보드</li>
                  <li>자동화된 리포트 생성</li>
                  <li>팀 성과 분석</li>
                </ul>
              </TextContent>
            </SpaceBetween>
          </Container>
        </Grid>

        {/* Benefits */}
        <Container
          header={
            <Header variant="h2" description="UpsideDown과 함께 성장하세요">
              도입 효과
            </Header>
          }
        >
          <Grid
            gridDefinition={[
              { colspan: { default: 12, s: 6 } },
              { colspan: { default: 12, s: 6 } },
              { colspan: { default: 12, s: 6 } },
              { colspan: { default: 12, s: 6 } },
            ]}
          >
            <Container>
              <SpaceBetween size="xs">
                <Box variant="h3" color="text-status-success">
                  40% 단축
                </Box>
                <Box variant="p">제품 출시 기간</Box>
              </SpaceBetween>
            </Container>
            <Container>
              <SpaceBetween size="xs">
                <Box variant="h3" color="text-status-success">
                  3배 향상
                </Box>
                <Box variant="p">팀 협업 효율성</Box>
              </SpaceBetween>
            </Container>
            <Container>
              <SpaceBetween size="xs">
                <Box variant="h3" color="text-status-success">
                  85% 감소
                </Box>
                <Box variant="p">프로젝트 리스크</Box>
              </SpaceBetween>
            </Container>
            <Container>
              <SpaceBetween size="xs">
                <Box variant="h3" color="text-status-success">
                  2배 증가
                </Box>
                <Box variant="p">고객 만족도</Box>
              </SpaceBetween>
            </Container>
          </Grid>
        </Container>

        {/* Use Cases */}
        <Container
          header={
            <Header
              variant="h2"
              description="다양한 팀이 UpsideDown을 활용하고 있습니다"
            >
              활용 사례
            </Header>
          }
        >
          <SpaceBetween size="l">
            <ColumnLayout columns={2}>
              <Container>
                <SpaceBetween size="s">
                  <Badge>Product Team</Badge>
                  <Box variant="h3">제품 기획팀</Box>
                  <TextContent>
                    <p>
                      비즈니스 목표와 고객 니즈를 정확히 파악하고, 데이터 기반의
                      의사결정을 내립니다.
                    </p>
                    <ul>
                      <li>Business Goal Alignment</li>
                      <li>Customer Experience Map</li>
                      <li>Service Blueprint</li>
                    </ul>
                  </TextContent>
                </SpaceBetween>
              </Container>
              <Container>
                <SpaceBetween size="s">
                  <Badge>Product Management</Badge>
                  <Box variant="h3">프로덕트 매니지먼트</Box>
                  <TextContent>
                    <p>
                      가설 검증부터 성과 측정까지, 제품의 전체 라이프사이클을
                      관리합니다.
                    </p>
                    <ul>
                      <li>Hypothesis Building Workshop</li>
                      <li>Prototyping & Validation</li>
                      <li>PR/FAQ & 1-Pagers</li>
                    </ul>
                  </TextContent>
                </SpaceBetween>
              </Container>
            </ColumnLayout>
            <Container>
              <SpaceBetween size="s">
                <Badge>Product Development</Badge>
                <Box variant="h3">개발팀</Box>
                <TextContent>
                  <p>
                    최신 애자일 방법론을 활용하여 빠르고 효율적인 개발을
                    진행합니다.
                  </p>
                  <ul>
                    <li>Event Storming으로 도메인 모델링</li>
                    <li>Story Workshop으로 요구사항 정의</li>
                    <li>LRP를 통한 장기 로드맵 수립</li>
                  </ul>
                </TextContent>
              </SpaceBetween>
            </Container>
          </SpaceBetween>
        </Container>

        {/* Customer Testimonials */}
        <Container
          header={
            <Header variant="h2" description="실제 사용자들의 생생한 후기">
              고객 후기
            </Header>
          }
        >
          <ColumnLayout columns={3}>
            <Container>
              <SpaceBetween size="xs">
                <Box variant="p">
                  {'"'}UpsideDown 도입 후 제품 개발 프로세스가 체계화되어 팀
                  전체의 생산성이 크게 향상되었습니다.{'"'}
                </Box>
                <Box variant="small">- 김현수, CTO @ 테크스타트업</Box>
              </SpaceBetween>
            </Container>
            <Container>
              <SpaceBetween size="xs">
                <Box variant="p">
                  {'"'}모든 팀원이 같은 방향을 바라보며 일할 수 있게 되었고,
                  고객 피드백 반영 속도가 3배 빨라졌습니다.{'"'}
                </Box>
                <Box variant="small">
                  - 박지영, Product Manager @ 핀테크기업
                </Box>
              </SpaceBetween>
            </Container>
            <Container>
              <SpaceBetween size="xs">
                <Box variant="p">
                  {'"'}복잡한 프로젝트도 UpsideDown의 체계적인 프로세스로 리스크
                  없이 관리할 수 있었습니다.{'"'}
                </Box>
                <Box variant="small">- 이준호, VP of Product @ 이커머스</Box>
              </SpaceBetween>
            </Container>
          </ColumnLayout>
        </Container>

        {/* Pricing */}
        <Container
          header={
            <Header variant="h2" description="팀 규모에 맞는 플랜을 선택하세요">
              요금제
            </Header>
          }
        >
          <Grid
            gridDefinition={[
              { colspan: { default: 12, s: 4 } },
              { colspan: { default: 12, s: 4 } },
              { colspan: { default: 12, s: 4 } },
            ]}
          >
            <Container>
              <SpaceBetween size="m">
                <Box variant="h3">Starter</Box>
                <Box fontSize="heading-xl">무료</Box>
                <TextContent>
                  <ul>
                    <li>최대 5명 사용자</li>
                    <li>기본 기능 모두 포함</li>
                    <li>커뮤니티 지원</li>
                  </ul>
                </TextContent>
                <Button fullWidth>무료로 시작</Button>
              </SpaceBetween>
            </Container>
            <Container>
              <SpaceBetween size="m">
                <Box variant="h3">
                  <Badge color="blue">인기</Badge> Professional
                </Box>
                <Box fontSize="heading-xl">₩49,000/월</Box>
                <TextContent>
                  <ul>
                    <li>무제한 사용자</li>
                    <li>고급 분석 기능</li>
                    <li>우선 지원</li>
                    <li>API 접근</li>
                  </ul>
                </TextContent>
                <Button variant="primary" fullWidth>
                  30일 무료 체험
                </Button>
              </SpaceBetween>
            </Container>
            <Container>
              <SpaceBetween size="m">
                <Box variant="h3">Enterprise</Box>
                <Box fontSize="heading-xl">맞춤 견적</Box>
                <TextContent>
                  <ul>
                    <li>모든 Professional 기능</li>
                    <li>전담 성공 매니저</li>
                    <li>온프레미스 설치</li>
                    <li>맞춤 교육</li>
                  </ul>
                </TextContent>
                <Button fullWidth>영업팀 문의</Button>
              </SpaceBetween>
            </Container>
          </Grid>
        </Container>

        {/* CTA Section */}
        <Container>
          <Box textAlign="center" padding={{ vertical: "xl" }}>
            <SpaceBetween size="l">
              <Box fontSize="heading-xl">
                지금 시작하고 제품 개발의 혁신을 경험하세요
              </Box>
              <SpaceBetween
                size="xs"
                direction="horizontal"
                alignItems="center"
              >
                <Button
                  variant="primary"
                  iconName="external"
                  onClick={() =>
                    router.push(
                      "/product-team/identify/business-goal-alignment"
                    )
                  }
                >
                  30일 무료 체험 시작하기
                </Button>
                <Box variant="span">신용카드 불필요</Box>
              </SpaceBetween>
            </SpaceBetween>
          </Box>
        </Container>
      </SpaceBetween>
    </ContentLayout>
  );
}
