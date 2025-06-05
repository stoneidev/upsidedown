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
  const { setSplitPanel, setHelpPanel, setSplitPanelOpen } = useAppLayout();
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
          header: "AI Review Feedback",
          children: (
            <SpaceBetween size="m">
              <Alert type="info" header="OKR Analysis Completed">
                We have analyzed your OKR. Please refer to the feedback below to
                improve.
              </Alert>

              <Box variant="h4">Target Customer Analysis</Box>
              <Box variant="p">
                {'"'}
                {customer}
                {'"'} has been clearly defined.
                <Box variant="span" color="text-status-error" fontWeight="bold">
                  {" "}
                  However, it would be better if we could further concretize the
                  customer's scale or industry.
                </Box>
              </Box>

              <Box variant="h4">Objective Analysis</Box>
              <Box variant="p">
                The current goal includes measurable elements.
                <StatusIndicator type="success">Good</StatusIndicator>
              </Box>
              <Box variant="p">
                <Box variant="span" color="text-status-error" fontWeight="bold">
                  Improvement Suggestion: Specifying the time frame (e.g., 2024
                  Mid-Year) would make it clearer.
                </Box>
              </Box>

              <Box variant="h4">Key Results Analysis</Box>
              <SpaceBetween size="xs">
                {keyResults
                  .filter((kr) => kr.value)
                  .map((kr, index) => (
                    <Box key={kr.id}>
                      <Badge color="blue">KR{index + 1}</Badge>{" "}
                      {kr.value.includes("%") || kr.value.match(/\d+/) ? (
                        <StatusIndicator type="success">
                          Measurable
                        </StatusIndicator>
                      ) : (
                        <Box
                          variant="span"
                          color="text-status-error"
                          fontWeight="bold"
                        >
                          Additional Specific Numerical Value Needed
                        </Box>
                      )}
                    </Box>
                  ))}
              </SpaceBetween>

              <Box variant="h4">Overall Score</Box>
              <Box fontSize="heading-l" fontWeight="bold">
                85/100
              </Box>
              <Box variant="p" color="text-body-secondary">
                Overall, it was well written, but
                <Box variant="span" color="text-status-error" fontWeight="bold">
                  {" "}
                  improving the specificity and time frame of the measurement
                  indicators
                </Box>
                would make it perfect.
              </Box>

              <Box variant="h4">Recommended Action</Box>
              <SpaceBetween size="xs">
                <Box>• Add Specific Achievement Deadline to Each KR</Box>
                <Box>• Specify Current Status (Baseline)</Box>
                <Box>• Consider Measurement Method and Responsible Person</Box>
              </SpaceBetween>
            </SpaceBetween>
          ),
        });
      } else {
        setSplitPanel({
          header: "OKR Writing Guide",
          children: (
            <SpaceBetween size="m">
              <Box variant="h4">Good OKR Writing Method</Box>
              <Box variant="p">
                <strong>Objective</strong> should be a qualitative goal that
                inspires and is achievable.
              </Box>
              <Box variant="p">
                <strong>Key Results</strong> should be quantitative indicators
                that can be measured.
              </Box>
              <Box variant="small">
                Example: {'"'}Improve customer satisfaction score to 4.5 or
                above{'"'}
              </Box>
            </SpaceBetween>
          ),
        });
      }
    },
    [setSplitPanel, customer, objective, keyResults]
  );

  useEffect(() => {
    setSplitPanelOpen(false);
    updateSplitPanel(isReviewing);

    setHelpPanel({
      header: "Business Goal Alignment",
      children: (
        <SpaceBetween size="m">
          <Box variant="p">
            Define your business goals clearly and set measurable results.
          </Box>
          <Box variant="h4">Help</Box>
          <Box variant="p">
            • Clearly define your target customer
            <br />
            • Objective should be achievable within 3-6 months
            <br />• Key Results should be 3-5 pieces
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
      newErrors.customer = "Please enter the target customer.";
    }

    if (!objective.trim()) {
      newErrors.objective = "Please enter the Objective.";
    }

    const hasEmptyKR = keyResults.some((kr) => !kr.value.trim());
    if (hasEmptyKR) {
      newErrors.keyResults = "Please enter all Key Results.";
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
      // Move to the next page
      router.push("/product-team/identify/customer-experience-map");
    }
  };

  return (
    <ContentLayout
      header={
        <Header
          variant="h1"
          description="Define your target customer and write the top-level OKR."
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
            header="Review Completed"
          >
            OKR was written correctly. You can proceed to the next step.
          </Alert>
        )}

        <Container
          header={
            <Header
              variant="h2"
              description="Clearly define the main target customer for your product."
            >
              Target Customer Definition
            </Header>
          }
        >
          <FormField
            label="Target Customer"
            description="Who is the main user of this product?"
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
              placeholder="e.g., Product Manager at an SMB"
            />
          </FormField>
        </Container>

        <Container
          header={
            <Header
              variant="h2"
              description="Set the top-level objective and measurable results for your target customer."
            >
              OKR Setup
            </Header>
          }
        >
          <SpaceBetween size="l">
            <FormField
              label="Objective"
              description="Write the qualitative goal you want to achieve."
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
                placeholder="e.g., Help customers systematically manage the product development process."
                rows={3}
              />
            </FormField>

            <FormField
              label="Key Results"
              description="Write quantitative indicators to measure achievement of the objective."
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
                      } e.g., Reduce time to market by 40%`}
                    />
                    <Button
                      iconName="close"
                      variant="icon"
                      disabled={keyResults.length === 1}
                      onClick={() => removeKeyResult(kr.id)}
                      ariaLabel={`Delete Key Result ${index + 1}`}
                    />
                  </Grid>
                ))}

                <Button
                  iconName="add-plus"
                  onClick={addKeyResult}
                  disabled={keyResults.length >= 5}
                >
                  Add Key Result
                </Button>
              </SpaceBetween>
            </FormField>
          </SpaceBetween>
        </Container>

        {showReview && (
          <Container header={<Header variant="h2">OKR Review</Header>}>
            <ColumnLayout columns={2} variant="text-grid">
              <div>
                <Box variant="awsui-key-label">Target Customer</Box>
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
            Review
          </Button>
          <Button
            variant="primary"
            onClick={handleNext}
            iconAlign="right"
            iconName="arrow-right"
          >
            Next
          </Button>
        </SpaceBetween>
      </SpaceBetween>
    </ContentLayout>
  );
}
