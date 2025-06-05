"use client";

import React, { useEffect, useState } from "react";
import {
  Container,
  ContentLayout,
  Header,
  Button,
  SpaceBetween,
  Box,
  Pagination,
  FormField,
  Input,
  Textarea,
  Modal,
  Select,
  Spinner,
  Table,
} from "@cloudscape-design/components";
import { useAppLayout } from "@/app/context/AppLayoutContext";
import { splitPanelConfig } from "@/app/config/splitPanel";
import { helpPanelConfig } from "@/app/config/helpPanel";
import {
  ecommerceUserStories,
  UserStory,
} from "@/app/data/ecommerceUserStories";

export default function StoryWorkshop() {
  const { setSplitPanel, setHelpPanel, setSplitPanelOpen } = useAppLayout();
  const [stories, setStories] = useState<UserStory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedStory, setSelectedStory] = useState<UserStory | null>(null);
  const [selectedItems, setSelectedItems] = useState<UserStory[]>([]);
  const [isModifyModalVisible, setIsModifyModalVisible] = useState(false);
  const [selectedStoryForModify, setSelectedStoryForModify] =
    useState<UserStory | null>(null);
  const [newStory, setNewStory] = useState<UserStory | null>(null);

  useEffect(() => {
    setSplitPanel({
      ...splitPanelConfig,
      header: selectedStory
        ? `Story Details - ${selectedStory.id}`
        : "Story Workshop Details",
      children: selectedStory ? (
        <SpaceBetween size="l">
          <Box variant="h3">{selectedStory.title}</Box>
          <Box>{selectedStory.description}</Box>

          <Box variant="h4">Priority</Box>
          <Box
            color={
              selectedStory.priority === "High"
                ? "text-status-error"
                : selectedStory.priority === "Medium"
                ? "text-status-warning"
                : "text-status-inactive"
            }
          >
            {selectedStory.priority}
          </Box>

          <Box variant="h4">Story Points</Box>
          <Box>{selectedStory.storyPoints || "Not estimated"}</Box>

          <Box variant="h4">Acceptance Criteria</Box>
          <ul>
            {selectedStory.acceptanceCriteria.map((criterion, index) => (
              <li key={index}>{criterion}</li>
            ))}
          </ul>

          <Box variant="h4">Definition of Done</Box>
          <ul>
            {selectedStory.definitionOfDone.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </SpaceBetween>
      ) : (
        "Create and manage user stories for your e-commerce project. You can generate user stories, edit them, and export to Jira."
      ),
    });
    setSplitPanelOpen(true);

    setHelpPanel({
      ...helpPanelConfig,
      header: "Story Workshop Help",
      children: (
        <>
          <h3>User Stories</h3>
          <p>
            User stories are short descriptions of features from an end-user
            perspective. The standard format is:
          </p>
          <blockquote>
            As a [type of user], I want [some goal] so that [some reason].
          </blockquote>
          <h3>Acceptance Criteria</h3>
          <p>
            Conditions that must be met for the story to be considered complete.
          </p>
          <h3>Definition of Done</h3>
          <p>
            A checklist of all the things that need to be true about the work
            before it can be called &quot;done&quot;.
          </p>
        </>
      ),
    });

    return () => {
      setSplitPanel(null);
      setHelpPanel(null);
      setSplitPanelOpen(false);
    };
  }, [setSplitPanel, setHelpPanel, setSplitPanelOpen, selectedStory]);

  const generateUserStories = () => {
    setIsLoading(true);
    // Simulate API call delay
    setTimeout(() => {
      setStories(ecommerceUserStories);
      setIsLoading(false);
    }, 3000);
  };

  const handleStorySelect = (selectedItems: UserStory[]) => {
    setSelectedItems(selectedItems);
    if (selectedItems.length > 0) {
      setSelectedStory(selectedItems[0]);
    }
  };

  const handleModifyClick = (story: UserStory) => {
    setSelectedStoryForModify(story);
    setIsModifyModalVisible(true);
  };

  const handleModifySubmit = () => {
    if (selectedStoryForModify) {
      const updatedStories = stories.map((story) =>
        story.id === selectedStoryForModify.id ? selectedStoryForModify : story
      );
      setStories(updatedStories);
      setIsModifyModalVisible(false);
      setSelectedStoryForModify(null);
    }
  };

  const handleModifyCancel = () => {
    setIsModifyModalVisible(false);
    setSelectedStoryForModify(null);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "text-status-error";
      case "Medium":
        return "text-status-warning";
      case "Low":
        return "text-status-inactive";
      default:
        return "text-body-secondary";
    }
  };

  const handleModifyInputChange = (
    field: keyof UserStory,
    value: string | number
  ) => {
    if (selectedStoryForModify) {
      setSelectedStoryForModify({
        ...selectedStoryForModify,
        [field]: value || "",
      });
    }
  };

  const handleInputChange = (
    field: keyof UserStory,
    value: string | number
  ) => {
    setNewStory((prev) => ({
      ...prev!,
      [field]: value || "",
    }));
  };

  const handleCreateStory = () => {
    if (!newStory) return;

    const story: UserStory = {
      id: `US-${stories.length + 1}`,
      title: newStory.title,
      description: newStory.description,
      priority: newStory.priority,
      storyPoints: newStory.storyPoints,
      status: "New",
      acceptanceCriteria: Array.isArray(newStory.acceptanceCriteria)
        ? newStory.acceptanceCriteria
        : (newStory.acceptanceCriteria as string).split("\n").filter(Boolean),
      definitionOfDone: Array.isArray(newStory.definitionOfDone)
        ? newStory.definitionOfDone
        : (newStory.definitionOfDone as string).split("\n").filter(Boolean),
    };

    setStories((prevStories) => [...prevStories, story]);
    setIsModalVisible(false);
    setNewStory(null);
  };

  return (
    <ContentLayout
      header={
        <Header
          variant="h1"
          actions={
            <SpaceBetween direction="horizontal" size="xs">
              <Button variant="primary" onClick={() => setIsModalVisible(true)}>
                Create User Story
              </Button>
            </SpaceBetween>
          }
        >
          User Story Workshop
        </Header>
      }
    >
      <SpaceBetween size="l">
        <Container
          header={
            <Header
              variant="h2"
              description="Generate and manage user stories for your e-commerce project"
              actions={
                <Button
                  variant="primary"
                  onClick={generateUserStories}
                  disabled={isLoading}
                >
                  {isLoading
                    ? "Generating..."
                    : "Generate E-commerce User Stories"}
                </Button>
              }
            >
              User Stories Management
            </Header>
          }
        >
          {isLoading ? (
            <Box textAlign="center" padding="l">
              <SpaceBetween size="m" direction="vertical" alignItems="center">
                <Spinner size="large" />
                <Box variant="p">Generating user stories...</Box>
              </SpaceBetween>
            </Box>
          ) : stories.length > 0 ? (
            <>
              <Table
                items={stories}
                columnDefinitions={[
                  {
                    id: "id",
                    header: "ID",
                    cell: (item) => item.id,
                  },
                  {
                    id: "title",
                    header: "Title",
                    cell: (item) => item.title,
                  },
                  {
                    id: "priority",
                    header: "Priority",
                    cell: (item) => (
                      <Box color={getPriorityColor(item.priority)}>
                        {item.priority}
                      </Box>
                    ),
                  },
                  {
                    id: "storyPoints",
                    header: "Story Points",
                    cell: (item) => item.storyPoints,
                  },
                  {
                    id: "status",
                    header: "Status",
                    cell: (item) => item.status,
                  },
                  {
                    id: "actions",
                    header: "Actions",
                    cell: (item) => (
                      <Button
                        variant="link"
                        onClick={() => handleModifyClick(item)}
                      >
                        Modify
                      </Button>
                    ),
                  },
                ]}
                selectionType="single"
                selectedItems={selectedItems}
                onSelectionChange={({ detail }) =>
                  handleStorySelect(detail.selectedItems)
                }
                trackBy="id"
              />
              <Box padding={{ top: "m" }}>
                <Pagination
                  currentPageIndex={currentPage}
                  pagesCount={Math.ceil(stories.length / itemsPerPage)}
                  onChange={({ detail }) =>
                    setCurrentPage(detail.currentPageIndex)
                  }
                />
              </Box>
            </>
          ) : (
            <Box textAlign="center" padding="l">
              <p>
                No user stories generated yet. Click the &quot;Generate
                E-commerce User Stories&quot; button to create user stories.
              </p>
            </Box>
          )}
        </Container>

        {stories.length > 0 && (
          <Container>
            <SpaceBetween size="l" direction="horizontal" alignItems="center">
              <Button variant="primary">Review Stories</Button>
              <Button>Export to Jira</Button>
              <Button>Next</Button>
            </SpaceBetween>
          </Container>
        )}

        {isModalVisible && (
          <Modal
            visible={isModalVisible}
            onDismiss={() => setIsModalVisible(false)}
            header="Create User Story"
            size="large"
          >
            <SpaceBetween size="l">
              <FormField label="Title">
                <Input
                  value={newStory?.title || ""}
                  onChange={({ detail }) =>
                    handleInputChange("title", detail.value)
                  }
                />
              </FormField>
              <FormField label="Description">
                <Textarea
                  value={newStory?.description || ""}
                  onChange={({ detail }) =>
                    handleInputChange("description", detail.value)
                  }
                />
              </FormField>
              <FormField label="Priority">
                <Select
                  selectedOption={{
                    label: newStory?.priority || "",
                    value: newStory?.priority || "",
                  }}
                  onChange={({ detail }) =>
                    handleInputChange(
                      "priority",
                      detail.selectedOption?.value || ""
                    )
                  }
                  options={[
                    { label: "High", value: "High" },
                    { label: "Medium", value: "Medium" },
                    { label: "Low", value: "Low" },
                  ]}
                />
              </FormField>
              <FormField label="Story Points">
                <Input
                  type="number"
                  value={newStory?.storyPoints?.toString() || ""}
                  onChange={({ detail }) =>
                    handleInputChange(
                      "storyPoints",
                      parseInt(detail.value) || 0
                    )
                  }
                />
              </FormField>
              <FormField label="Acceptance Criteria">
                <Textarea
                  value={newStory?.acceptanceCriteria?.join("\n") || ""}
                  onChange={({ detail }) =>
                    handleInputChange("acceptanceCriteria", detail.value)
                  }
                />
              </FormField>
              <FormField label="Definition of Done">
                <Textarea
                  value={newStory?.definitionOfDone?.join("\n") || ""}
                  onChange={({ detail }) =>
                    handleInputChange("definitionOfDone", detail.value)
                  }
                />
              </FormField>
            </SpaceBetween>
            <Box float="right">
              <SpaceBetween direction="horizontal" size="xs">
                <Button onClick={() => setIsModalVisible(false)}>Cancel</Button>
                <Button variant="primary" onClick={handleCreateStory}>
                  Create Story
                </Button>
              </SpaceBetween>
            </Box>
          </Modal>
        )}

        {isModifyModalVisible && selectedStoryForModify && (
          <Modal
            visible={isModifyModalVisible}
            onDismiss={handleModifyCancel}
            header="Modify User Story"
            size="large"
          >
            <Box
              css={{
                maxWidth: 600,
                margin: "0 auto", 
                minHeight: 500,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box style={{ width: "100%" }}>
                <SpaceBetween size="l">
                  <FormField label="Title">
                    <Input
                      value={selectedStoryForModify.title}
                      onChange={({ detail }) =>
                        handleModifyInputChange("title", detail.value)
                      }
                    />
                  </FormField>
                  <FormField label="Description">
                    <Textarea
                      value={selectedStoryForModify.description}
                      onChange={({ detail }) =>
                        handleModifyInputChange("description", detail.value)
                      }
                    />
                  </FormField>
                  <FormField label="Priority">
                    <Select
                      selectedOption={{
                        label: selectedStoryForModify.priority,
                        value: selectedStoryForModify.priority,
                      }}
                      onChange={({ detail }) =>
                        handleModifyInputChange(
                          "priority",
                          detail.selectedOption?.value || "Medium"
                        )
                      }
                      options={[
                        { label: "High", value: "High" },
                        { label: "Medium", value: "Medium" },
                        { label: "Low", value: "Low" },
                      ]}
                    />
                  </FormField>
                  <FormField label="Story Points">
                    <Input
                      type="number"
                      value={
                        selectedStoryForModify &&
                        typeof selectedStoryForModify.storyPoints === "number"
                          ? selectedStoryForModify.storyPoints.toString()
                          : "0"
                      }
                      onChange={({ detail }) =>
                        handleModifyInputChange(
                          "storyPoints",
                          detail.value !== undefined &&
                            detail.value !== "" &&
                            !isNaN(Number(detail.value))
                            ? parseInt(detail.value)
                            : 0
                        )
                      }
                    />
                  </FormField>
                  <FormField label="Acceptance Criteria">
                    <Textarea
                      value={selectedStoryForModify.acceptanceCriteria.join(
                        "\n"
                      )}
                      onChange={({ detail }) =>
                        handleModifyInputChange(
                          "acceptanceCriteria",
                          detail.value
                        )
                      }
                    />
                  </FormField>
                  <FormField label="Definition of Done">
                    <Textarea
                      value={selectedStoryForModify.definitionOfDone.join("\n")}
                      onChange={({ detail }) =>
                        handleModifyInputChange(
                          "definitionOfDone",
                          detail.value
                        )
                      }
                    />
                  </FormField>
                </SpaceBetween>
              </Box>
              <Box
                width="100%"
                display="flex"
                justifyContent="flex-end"
                margin={{ top: "l" }}
              >
                <SpaceBetween direction="horizontal" size="xs">
                  <Button onClick={handleModifyCancel}>Cancel</Button>
                  <Button variant="primary" onClick={handleModifySubmit}>
                    Save Changes
                  </Button>
                </SpaceBetween>
              </Box>
            </Box>
          </Modal>
        )}
      </SpaceBetween>
    </ContentLayout>
  );
}
