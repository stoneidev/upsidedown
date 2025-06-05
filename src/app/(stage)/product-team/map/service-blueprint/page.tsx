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
    name: "Physical Evidence",
    icon: "view-full",
    color: "blue",
  },
  "customer-actions": {
    name: "Customer Actions",
    icon: "user-profile",
    color: "green",
  },
  frontstage: {
    name: "Frontstage",
    icon: "contact",
    color: "severity-neutral",
  },
  backstage: { name: "Backstage", icon: "settings", color: "grey" },
  support: { name: "Support Process", icon: "status-positive", color: "red" },
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
          header: "AI Review Feedback",
          children: (
            <SpaceBetween size="m">
              <Alert type="info" header="Service Blueprint Analysis Completed">
                We have analyzed the service blueprint you created.
              </Alert>

              <Box variant="h4">Service Structure Analysis</Box>
              <SpaceBetween size="xs">
                {layers.map((layer) => (
                  <Box key={layer.id}>
                    <Badge color={layerTypes[layer.type].color}>
                      {layerTypes[layer.type].name}
                    </Badge>{" "}
                    {layer.elements.length > 0 ? (
                      <StatusIndicator type="success">
                        {layer.elements.length} elements
                      </StatusIndicator>
                    ) : (
                      <Box
                        variant="span"
                        color="text-status-error"
                        fontWeight="bold"
                      >
                        No elements
                      </Box>
                    )}
                  </Box>
                ))}
              </SpaceBetween>

              <Box variant="h4">Improvement Points</Box>
              <Box variant="p">
                <Box variant="span" color="text-status-error" fontWeight="bold">
                  Please clearly distinguish between the Line of Visibility and
                  the Line of Interaction to make the relationships between
                  layers clearer.
                </Box>
              </Box>

              <Box variant="h4">Recommendations</Box>
              <SpaceBetween size="xs">
                <Box>• Add time required for each touchpoint</Box>
                <Box>
                  • Identify and develop countermeasures for Fail Points
                </Box>
                <Box>• Mark key moments that affect customer satisfaction</Box>
              </SpaceBetween>
            </SpaceBetween>
          ),
        });
      } else {
        setSplitPanel({
          header: "Service Blueprint Guide",
          children: (
            <SpaceBetween size="m">
              <Box variant="h4">What is a Service Blueprint?</Box>
              <Box variant="p">
                Visualize the entire service process to connect customer
                experience and internal operations.
              </Box>
              <Box variant="h4">Key Layers</Box>
              <Box variant="p">
                • Physical Evidence: What the customer sees and touches
                <br />
                • Customer Actions: Activities performed by the customer
                <br />
                • Frontstage: Employee activities visible to the customer
                <br />
                • Backstage: Employee activities not visible to the customer
                <br />• Support Process: Systems that enable the service
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
            Map all components and processes of the service systematically.
          </Box>
          <Box variant="h4">Writing Tips</Box>
          <Box variant="p">
            • Write from left to right in chronological order
            <br />
            • Each layer is separated by the Line of Visibility
            <br />
            • Clearly mark interaction points
            <br />• Show connections between Backstage and Support Process
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
      newErrors.serviceName = "Please enter the service name.";
    }

    if (!serviceDescription.trim()) {
      newErrors.serviceDescription = "Please enter the service description.";
    }

    const hasNoElements = layers.every((layer) => layer.elements.length === 0);
    if (hasNoElements) {
      newErrors.layers = "Please add elements to at least one layer.";
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
          description="Visualize the entire service process and find improvement opportunities"
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
            header="Review Completed"
          >
            Service blueprint has been created. You can proceed to the next
            step.
          </Alert>
        )}

        <Container
          header={
            <Header
              variant="h2"
              description="Enter the basic information of the service to analyze"
            >
              Service Information
            </Header>
          }
        >
          <SpaceBetween size="l">
            <FormField
              label="Service Name"
              errorText={errors.serviceName}
              stretch
            >
              <Input
                value={serviceName}
                onChange={({ detail }) => {
                  setServiceName(detail.value);
                  setErrors({ ...errors, serviceName: "" });
                  setIsReviewing(false);
                }}
                placeholder="e.g., Online Product Ordering Service"
              />
            </FormField>

            <FormField
              label="Service Description"
              description="Describe the purpose and main features of the service."
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
                placeholder="e.g., The entire process where customers search, select, order, and receive products online."
                rows={3}
              />
            </FormField>
          </SpaceBetween>
        </Container>

        <Container
          header={
            <Header variant="h2" description="Add elements to each layer">
              Service Layer
            </Header>
          }
        >
          {errors.layers && (
            <Alert type="error" header="Error">
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
                      <FormField label="Add Element">
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
                            } element input`}
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
                                  ariaLabel={`${element} remove`}
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
            header={<Header variant="h2">Service Blueprint Review</Header>}
          >
            <SpaceBetween size="m">
              <ColumnLayout columns={2} variant="text-grid">
                <div>
                  <Box variant="awsui-key-label">Service Name</Box>
                  <Box>{serviceName}</Box>
                </div>
                <div>
                  <Box variant="awsui-key-label">Service Description</Box>
                  <Box>{serviceDescription}</Box>
                </div>
              </ColumnLayout>

              <Box variant="h4">Service Layer</Box>
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
