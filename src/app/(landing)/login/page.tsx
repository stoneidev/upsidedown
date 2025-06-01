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
import Box from "@cloudscape-design/components/box";
import Grid from "@cloudscape-design/components/grid";
import TextContent from "@cloudscape-design/components/text-content";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [emailError, setEmailError] = React.useState("");
  const [passwordError, setPasswordError] = React.useState("");

  const validateForm = () => {
    let isValid = true;
    setEmailError("");
    setPasswordError("");

    if (!email) {
      setEmailError("이메일을 입력해주세요.");
      isValid = false;
    }
    if (!password) {
      setPasswordError("비밀번호를 입력해주세요.");
      isValid = false;
    }
    return isValid;
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // 로그인 처리 로직
      router.push("/product-team/identify/business-goal-alignment");
    }
  };

  return (
    <ContentLayout
      headerVariant="high-contrast"
      maxContentWidth={400}
      header={
        <SpaceBetween size="xs">
          <Box textAlign="center" padding={{ top: "xl", bottom: "xs" }}>
            <Box fontSize="display-l" fontWeight="bold">
              UpsideDown
            </Box>
          </Box>
          <Box textAlign="center" variant="p" color="text-body-secondary">
            제품 개발 프로세스 관리 플랫폼
          </Box>
        </SpaceBetween>
      }
    >
      <Grid gridDefinition={[{ colspan: { default: 12 } }]}>
        <Container>
          <form onSubmit={handleLogin}>
            <SpaceBetween size="xl">
              <SpaceBetween size="m">
                <Header variant="h1">로그인</Header>

                <FormField label="이메일" errorText={emailError} stretch>
                  <Input
                    type="email"
                    value={email}
                    onChange={({ detail }) => {
                      setEmail(detail.value);
                      setEmailError("");
                    }}
                    placeholder="email@example.com"
                    autoFocus
                  />
                </FormField>

                <FormField label="비밀번호" errorText={passwordError} stretch>
                  <Input
                    type="password"
                    value={password}
                    onChange={({ detail }) => {
                      setPassword(detail.value);
                      setPasswordError("");
                    }}
                    placeholder="비밀번호를 입력하세요"
                  />
                </FormField>

                <Box textAlign="right">
                  <Link fontSize="body-s">비밀번호를 잊으셨나요?</Link>
                </Box>
              </SpaceBetween>

              <SpaceBetween size="s">
                <Button variant="primary" fullWidth formAction="submit">
                  로그인
                </Button>

                <Box
                  textAlign="center"
                  fontSize="body-s"
                  color="text-body-secondary"
                >
                  또는
                </Box>

                <Button fullWidth iconAlign="left">
                  Google로 계속하기
                </Button>
              </SpaceBetween>
            </SpaceBetween>
          </form>
        </Container>

        <Box textAlign="center" margin={{ top: "l" }}>
          <TextContent>
            <p>
              <Box variant="span" fontSize="body-s" color="text-body-secondary">
                아직 계정이 없으신가요?{" "}
              </Box>
              <Link fontSize="body-s" onFollow={() => router.push("/signup")}>
                회원가입
              </Link>
            </p>
          </TextContent>
        </Box>
      </Grid>

      <Box margin={{ top: "xxl" }}>
        <Box textAlign="center" fontSize="body-s" color="text-body-secondary">
          <SpaceBetween size="xs" direction="horizontal" alignItems="center">
            <Link fontSize="body-s" external>
              이용약관
            </Link>
            <Box variant="span">•</Box>
            <Link fontSize="body-s" external>
              개인정보처리방침
            </Link>
            <Box variant="span">•</Box>
            <Link fontSize="body-s">문의하기</Link>
          </SpaceBetween>
        </Box>
      </Box>
    </ContentLayout>
  );
}
