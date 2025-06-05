"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import {
  Container,
  ContentLayout,
  Header,
  Link,
  SpaceBetween,
  Button,
  Box,
  FormField,
  Alert,
  Cards,
  Badge,
  TextContent,
} from "@cloudscape-design/components";
import { useAppLayout } from "@/app/context/AppLayoutContext";
import { useRouter } from "next/navigation";

export default function EventStorming() {
  const { setSplitPanel, setHelpPanel, setSplitPanelOpen } = useAppLayout();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [imageName, setImageName] = useState<string>("");
  const [recognizedEvents, setRecognizedEvents] = useState<string[]>([]);
  const [recognizedBCs, setRecognizedBCs] = useState<string[]>([]);
  const [isRecognizing, setIsRecognizing] = useState<boolean>(false);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [isReviewing, setIsReviewing] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!uploadedImage) {
      newErrors.image = "Please upload an image";
    }

    if (!showResults) {
      newErrors.analysis = "Please complete the analysis first";
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
      router.push("/product-development/develop/event-storming");
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
        setImageName(file.name);
      };
      reader.readAsDataURL(file);
      setRecognizedEvents([]);
      setRecognizedBCs([]);
      setShowResults(false);
    }
  };

  const handleRecognize = () => {
    if (!uploadedImage) return;

    setIsRecognizing(true);
    setShowResults(false);
    setIsReviewing(false);

    // Simulate recognition with a delay to show processing effect
    setTimeout(() => {
      // Simulate recognition results
      setRecognizedEvents([
        "Order Placed",
        "Payment Processed",
        "Payment Failed",
        "Order Confirmed",
        "Shipping Initiated",
        "Order Delivered",
        "Order Cancelled",
        "Refund Requested",
        "Refund Processed",
      ]);
      setRecognizedBCs([
        "Order Management",
        "Payment Processing",
        "Inventory Management",
        "Shipping & Logistics",
        "Customer Management",
      ]);
      setIsRecognizing(false);
      setShowResults(true);
      setIsReviewing(true);
      setShowReview(true);
    }, 1500);
  };

  useEffect(() => {
    setSplitPanel({
      header: "Event Storming Guide",
      children: (
        <SpaceBetween size="m">
          <TextContent>
            <p>
              Upload a big picture event storming image and click
              &quot;Recognize&quot; to analyze events and bounded contexts.
            </p>
            <h4>What is Event Storming?</h4>
            <p>
              Event Storming is a collaborative workshop technique used to model
              complex business domains by identifying domain events, commands,
              aggregates, and bounded contexts.
            </p>
            <h4>How to use this tool:</h4>
            <ol>
              <li>Take a photo of your Event Storming session board</li>
              <li>Upload the image using the &quot;Choose File&quot; button</li>
              <li>
                Click &quot;Recognize&quot; to extract events and bounded
                contexts
              </li>
              <li>Review and refine the recognized items</li>
            </ol>
          </TextContent>
        </SpaceBetween>
      ),
    });
    setSplitPanelOpen(true);

    setHelpPanel({
      header: "Event Storming Help",
      children: (
        <SpaceBetween size="m">
          <TextContent>
            <p>
              Event Storming helps visualize complex business domains by
              identifying key events and bounded contexts.
            </p>
            <h4>Tips:</h4>
            <ul>
              <li>Use clear photos with good lighting</li>
              <li>Ensure sticky notes are readable in the image</li>
              <li>
                Different color sticky notes help identify different types of
                elements
              </li>
            </ul>
          </TextContent>
        </SpaceBetween>
      ),
    });

    return () => {
      setSplitPanel(null);
      setHelpPanel(null);
      setSplitPanelOpen(false);
    };
  }, [setSplitPanel, setHelpPanel, setSplitPanelOpen]);

  return (
    <ContentLayout
      header={
        <Header
          variant="h1"
          description="Upload your Event Storming board image to recognize events and bounded contexts"
          info={<Link variant="info">Info</Link>}
        >
          Event Storming Analysis
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
            header="Review Complete"
          >
            Event storming has been completed. You can proceed to the next step.
          </Alert>
        )}

        <Container
          header={
            <Header
              variant="h2"
              description="Upload and analyze your Event Storming diagram"
            >
              Event Storming
            </Header>
          }
        >
          {errors.image && <Alert type="error">{errors.image}</Alert>}
          {errors.analysis && <Alert type="error">{errors.analysis}</Alert>}
          <SpaceBetween size="m">
            <FormField label="Choose an image from your event storming workshop">
              <SpaceBetween
                size="xs"
                direction="horizontal"
                alignItems="center"
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  ref={fileInputRef}
                  style={{ display: "none" }}
                />
                <Button iconName="upload" onClick={handleButtonClick}>
                  Choose File
                </Button>
                {imageName && (
                  <Box variant="span" color="text-body-secondary">
                    {imageName}
                  </Box>
                )}
              </SpaceBetween>
            </FormField>

            {uploadedImage && (
              <Container>
                <SpaceBetween size="s">
                  <Box variant="h3">Preview</Box>
                  <Image
                    src={uploadedImage}
                    alt="Uploaded Event Storming Diagram"
                    width={800}
                    height={400}
                    style={{
                      maxWidth: "100%",
                      height: "auto",
                      maxHeight: "400px",
                      border: "1px solid #eaeded",
                      borderRadius: "4px",
                      padding: "8px",
                      objectFit: "contain",
                    }}
                    unoptimized
                  />
                  <Box textAlign="right">
                    <Button
                      variant="primary"
                      onClick={handleRecognize}
                      disabled={isRecognizing}
                      loading={isRecognizing}
                    >
                      {isRecognizing
                        ? "Recognizing..."
                        : "Recognize Events & BCs"}
                    </Button>
                  </Box>
                </SpaceBetween>
              </Container>
            )}
          </SpaceBetween>
        </Container>

        {showResults && (
          <Container
            header={
              <Header
                variant="h2"
                description="Analysis results from your Event Storming board"
                actions={<Button iconName="download">Export Results</Button>}
              >
                Recognition Results
              </Header>
            }
          >
            <SpaceBetween size="l">
              {recognizedEvents.length > 0 && (
                <div>
                  <Box variant="h3" padding={{ bottom: "xs" }}>
                    Recognized Domain Events
                  </Box>
                  <Cards
                    cardDefinition={{
                      header: (item) => item,
                      sections: [
                        {
                          id: "type",
                          content: () => <Badge color="blue">Event</Badge>,
                        },
                      ],
                    }}
                    cardsPerRow={[
                      { cards: 1 },
                      { minWidth: 400, cards: 2 },
                      { minWidth: 800, cards: 3 },
                    ]}
                    items={recognizedEvents}
                    trackBy="indexAsKey"
                    empty={
                      <Box textAlign="center" color="inherit">
                        <b>No events found</b>
                        <Box
                          padding={{ bottom: "s" }}
                          variant="p"
                          color="inherit"
                        >
                          No domain events were recognized in the image.
                        </Box>
                      </Box>
                    }
                  />
                </div>
              )}

              {recognizedBCs.length > 0 && (
                <div>
                  <Box variant="h3" padding={{ bottom: "xs" }}>
                    Recognized Bounded Contexts
                  </Box>
                  <Cards
                    cardDefinition={{
                      header: (item) => item,
                      sections: [
                        {
                          id: "type",
                          content: () => (
                            <Badge color="green">Bounded Context</Badge>
                          ),
                        },
                      ],
                    }}
                    cardsPerRow={[
                      { cards: 1 },
                      { minWidth: 400, cards: 2 },
                      { minWidth: 800, cards: 3 },
                    ]}
                    items={recognizedBCs}
                    trackBy="indexAsKey"
                    empty={
                      <Box textAlign="center" color="inherit">
                        <b>No bounded contexts found</b>
                        <Box
                          padding={{ bottom: "s" }}
                          variant="p"
                          color="inherit"
                        >
                          No bounded contexts were recognized in the image.
                        </Box>
                      </Box>
                    }
                  />
                </div>
              )}

              <Alert>
                These results are simulated for demonstration purposes. In a
                real application, AI/ML would analyze the image to extract
                events and bounded contexts.
              </Alert>
            </SpaceBetween>
          </Container>
        )}
        <SpaceBetween direction="horizontal" size="xs">
          <Button
            onClick={handleReview}
            iconAlign="right"
            iconName="search"
            disabled={isReviewing}
          >
            Review
          </Button>
          <Button
            variant="primary"
            onClick={handleNext}
            iconAlign="right"
            iconName="arrow-right"
            disabled={!isReviewing}
          >
            Next
          </Button>
        </SpaceBetween>
      </SpaceBetween>
    </ContentLayout>
  );
}
