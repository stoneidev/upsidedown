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
      setEmailError("Please enter your email.");
      isValid = false;
    }
    if (!password) {
      setPasswordError("Please enter your password.");
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
            Product development process management platform
          </Box>
        </SpaceBetween>
      }
    >
      <Grid gridDefinition={[{ colspan: { default: 12 } }]}>
        <Container>
          <form onSubmit={handleLogin}>
            <SpaceBetween size="xl">
              <SpaceBetween size="m">
                <Header variant="h1">Login</Header>

                <FormField label="Email" errorText={emailError} stretch>
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

                <FormField label="Password" errorText={passwordError} stretch>
                  <Input
                    type="password"
                    value={password}
                    onChange={({ detail }) => {
                      setPassword(detail.value);
                      setPasswordError("");
                    }}
                    placeholder="Enter your password"
                  />
                </FormField>

                <Box textAlign="right">
                  <Link fontSize="body-s">Forgot your password?</Link>
                </Box>
              </SpaceBetween>

              <SpaceBetween size="s">
                <Button variant="primary" fullWidth formAction="submit">
                  Login
                </Button>

                <Box
                  textAlign="center"
                  fontSize="body-s"
                  color="text-body-secondary"
                >
                  or
                </Box>

                <Button fullWidth iconAlign="left">
                  Continue with Google
                </Button>
              </SpaceBetween>
            </SpaceBetween>
          </form>
        </Container>

        <Box textAlign="center" margin={{ top: "l" }}>
          <TextContent>
            <p>
              <Box variant="span" fontSize="body-s" color="text-body-secondary">
                Don't have an account yet?{" "}
              </Box>
              <Link fontSize="body-s" onFollow={() => router.push("/signup")}>
                Sign Up
              </Link>
            </p>
          </TextContent>
        </Box>
      </Grid>

      <Box margin={{ top: "xxl" }}>
        <Box textAlign="center" fontSize="body-s" color="text-body-secondary">
          <SpaceBetween size="xs" direction="horizontal" alignItems="center">
            <Link fontSize="body-s" external>
              Terms of Service
            </Link>
            <Box variant="span">•</Box>
            <Link fontSize="body-s" external>
              Privacy Policy
            </Link>
            <Box variant="span">•</Box>
            <Link fontSize="body-s">Contact Us</Link>
          </SpaceBetween>
        </Box>
      </Box>
    </ContentLayout>
  );
}
