"use client";

import * as React from "react";
import ContentLayout from "@cloudscape-design/components/content-layout";
import Container from "@cloudscape-design/components/container";
import Header from "@cloudscape-design/components/header";
import SpaceBetween from "@cloudscape-design/components/space-between";
import Button from "@cloudscape-design/components/button";
import Input from "@cloudscape-design/components/input";
import FormField from "@cloudscape-design/components/form-field";
import Link from "@cloudscape-design/components/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleLogin = () => {
    // 로그인 처리 로직
    router.push("/product-team/identify/business-goal-alignment");
  };

  return (
    <ContentLayout
      defaultPadding
      header={
        <Header
          variant="h1"
          info={<Link variant="info">Info</Link>}
          description="UpsideDown에 로그인하세요"
        >
          로그인
        </Header>
      }
    >
      <Container
        header={
          <Header variant="h2" description="계정 정보를 입력하세요">
            로그인 정보
          </Header>
        }
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
        >
          <SpaceBetween size="l">
            <FormField label="이메일">
              <Input
                type="email"
                value={email}
                onChange={({ detail }) => setEmail(detail.value)}
                placeholder="email@example.com"
              />
            </FormField>

            <FormField label="비밀번호">
              <Input
                type="password"
                value={password}
                onChange={({ detail }) => setPassword(detail.value)}
                placeholder="비밀번호를 입력하세요"
              />
            </FormField>

            <SpaceBetween size="xs" direction="horizontal">
              <Button variant="primary" onClick={handleLogin}>
                로그인
              </Button>
              <Button onClick={() => router.push("/")}>돌아가기</Button>
            </SpaceBetween>
          </SpaceBetween>
        </form>
      </Container>
    </ContentLayout>
  );
}
