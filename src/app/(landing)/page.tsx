"use client";

import * as React from "react";
import ContentLayout from "@cloudscape-design/components/content-layout";
import Container from "@cloudscape-design/components/container";
import Header from "@cloudscape-design/components/header";
import SpaceBetween from "@cloudscape-design/components/space-between";
import Link from "@cloudscape-design/components/link";
import Alert from "@cloudscape-design/components/alert";
import Button from "@cloudscape-design/components/button";
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
            info={<Link variant="info">Info</Link>}
            description="Product Development Platform"
            actions={
              <SpaceBetween size="xs" direction="horizontal">
                <Button onClick={() => router.push("/login")}>로그인</Button>
              </SpaceBetween>
            }
          >
            UpsideDown
          </Header>

          <Alert statusIconAriaLabel="Info">
            제품 개발 프로세스를 체계적으로 관리하고 개선하세요.
          </Alert>
        </SpaceBetween>
      }
    >
      <Container
        header={
          <Header variant="h2" description="프로덕트 개발을 시작하세요">
            시작하기
          </Header>
        }
      >
        <Button
          variant="primary"
          onClick={() =>
            router.push("/product-team/identify/business-goal-alignment")
          }
        >
          시작하기
        </Button>
      </Container>
    </ContentLayout>
  );
}
