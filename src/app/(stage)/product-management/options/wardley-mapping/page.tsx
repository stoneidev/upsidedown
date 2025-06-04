"use client";

import React, { useEffect, useState } from "react";
import {
  Container,
  ContentLayout,
  Header,
  Link,
  SpaceBetween,
  Button,
  Input,
  Select,
  Alert,
} from "@cloudscape-design/components";
import { useAppLayout } from "@/app/context/AppLayoutContext";
import ReactMarkdown from "react-markdown";
import ReactFlow, { Background, Controls, MiniMap } from "reactflow";
import "reactflow/dist/style.css";

export default function WardleyMapping() {
  const { setSplitPanel, setHelpPanel, setSplitPanelOpen } = useAppLayout();

  // 요소 관리
  const [components, setComponents] = useState([
    { name: "User", stage: "Product", description: "End user of the service" },
    { name: "Web App", stage: "Product", description: "Frontend interface" },
    { name: "API", stage: "Custom", description: "Backend API layer" },
    {
      name: "Database",
      stage: "Commodity",
      description: "Stores persistent data",
    },
  ]);
  const [newComponent, setNewComponent] = useState({
    name: "",
    stage: "Product",
    description: "",
  });
  const [dependencies, setDependencies] = useState([
    { from: "User", to: "Web App" },
    { from: "Web App", to: "API" },
    { from: "API", to: "Database" },
  ]);
  const [newDep, setNewDep] = useState({ from: "", to: "" });
  const [alert, setAlert] = useState<string | null>(null);
  const [showDiagram, setShowDiagram] = useState(false);

  const stageOptions = [
    { value: "Genesis", label: "Genesis" },
    { value: "Custom", label: "Custom" },
    { value: "Product", label: "Product" },
    { value: "Commodity", label: "Commodity" },
  ];

  // 진화 단계별 x좌표 매핑
  const stageX = {
    Genesis: 0,
    Custom: 200,
    Product: 400,
    Commodity: 600,
  };

  // 노드/엣지 생성
  const nodes = components.map((c, i) => ({
    id: c.name,
    data: { label: c.name },
    position: { x: stageX[c.stage as keyof typeof stageX] ?? 400, y: i * 100 },
    style: {
      minWidth: 120,
      border: "1px solid #888",
      borderRadius: 8,
      background: "#fff",
    },
  }));
  const edges = dependencies.map((dep, i) => ({
    id: `e${i}`,
    source: dep.from,
    target: dep.to,
    animated: true,
    style: { stroke: "#0070f3" },
  }));

  useEffect(() => {
    setSplitPanel({
      header: "Wardley Mapping Guide",
      children: (
        <div>
          Enter components and their dependencies to build a text-based Wardley
          Map. Each component has a name, evolution stage, and description.
          Dependencies describe how components rely on each other.
        </div>
      ),
    });
    setSplitPanelOpen(true);
    setHelpPanel({
      header: "Wardley Mapping Help",
      children: (
        <div>
          <b>Tip:</b> Use Genesis for novel ideas, Custom for bespoke solutions,
          Product for off-the-shelf, and Commodity for utilities.
        </div>
      ),
    });
    return () => {
      setSplitPanel(null);
      setHelpPanel(null);
      setSplitPanelOpen(false);
    };
  }, [setSplitPanel, setHelpPanel, setSplitPanelOpen]);

  // 요소 추가/삭제
  const handleAddComponent = () => {
    if (newComponent.name.trim()) {
      setComponents([...components, newComponent]);
      setNewComponent({ name: "", stage: "Product", description: "" });
      setAlert("Component added.");
      setTimeout(() => setAlert(null), 2000);
    }
  };
  const handleRemoveComponent = (idx: number) => {
    setComponents(components.filter((_, i) => i !== idx));
    setDependencies(
      dependencies.filter(
        (dep) =>
          dep.from !== components[idx].name && dep.to !== components[idx].name
      )
    );
  };

  // 의존 관계 추가/삭제
  const handleAddDep = () => {
    if (newDep.from && newDep.to && newDep.from !== newDep.to) {
      setDependencies([...dependencies, newDep]);
      setNewDep({ from: "", to: "" });
      setAlert("Dependency added.");
      setTimeout(() => setAlert(null), 2000);
    }
  };
  const handleRemoveDep = (idx: number) => {
    setDependencies(dependencies.filter((_, i) => i !== idx));
  };

  // 텍스트 요약 생성
  function generateSummary() {
    return (
      `# Wardley Map (Text Summary)\n\n` +
      `## Components\n` +
      components
        .map((c) => `- **${c.name}** (${c.stage}): ${c.description}`)
        .join("\n") +
      `\n\n## Dependencies\n` +
      dependencies
        .map((dep) => `- **${dep.from}** → **${dep.to}**`)
        .join("\n") +
      `\n\n## Value Chain Narrative\n` +
      `The map starts with the **User** who interacts with the **Web App**. The Web App depends on the **API**, which in turn relies on the **Database**. Each component is positioned according to its stage of evolution, from Genesis to Commodity. This structure helps identify areas for innovation and potential commoditization.`
    );
  }

  return (
    <ContentLayout
      header={
        <Header variant="h1" info={<Link variant="info">Info</Link>}>
          Wardley Mapping (Text-based)
        </Header>
      }
    >
      <SpaceBetween size="l">
        {alert && <Alert type="success">{alert}</Alert>}
        <Container header={<Header variant="h2">Components</Header>}>
          <SpaceBetween size="m">
            {components.map((c, idx) => (
              <div
                key={idx}
                style={{ display: "flex", alignItems: "center", gap: 8 }}
              >
                <span style={{ flex: 1 }}>
                  <b>{c.name}</b> ({c.stage}) - {c.description}
                </span>
                <Button
                  iconName="close"
                  variant="icon"
                  onClick={() => handleRemoveComponent(idx)}
                />
              </div>
            ))}
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <Input
                placeholder="Component Name"
                value={newComponent.name}
                onChange={({ detail }) =>
                  setNewComponent({ ...newComponent, name: detail.value })
                }
              />
              <Select
                selectedOption={
                  stageOptions.find(
                    (opt) => opt.value === (newComponent.stage || "Product")
                  ) || stageOptions[2]
                }
                onChange={({ detail }) =>
                  setNewComponent({
                    ...newComponent,
                    stage: detail.selectedOption.value || "Product",
                  })
                }
                options={stageOptions}
                placeholder="Stage"
                ariaLabel="Stage"
                selectedAriaLabel="Selected stage"
              />
              <Input
                placeholder="Description"
                value={newComponent.description}
                onChange={({ detail }) =>
                  setNewComponent({
                    ...newComponent,
                    description: detail.value,
                  })
                }
              />
              <Button
                onClick={handleAddComponent}
                variant="primary"
                iconName="add-plus"
              >
                Add
              </Button>
            </div>
          </SpaceBetween>
        </Container>
        <Container header={<Header variant="h2">Dependencies</Header>}>
          <SpaceBetween size="m">
            {dependencies.map((dep, idx) => (
              <div
                key={idx}
                style={{ display: "flex", alignItems: "center", gap: 8 }}
              >
                <span style={{ flex: 1 }}>
                  <b>{dep.from}</b> → <b>{dep.to}</b>
                </span>
                <Button
                  iconName="close"
                  variant="icon"
                  onClick={() => handleRemoveDep(idx)}
                />
              </div>
            ))}
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <Select
                selectedOption={
                  components.find((c) => c.name === newDep.from)
                    ? { label: newDep.from, value: newDep.from }
                    : { label: "", value: "" }
                }
                onChange={({ detail }) =>
                  setNewDep({
                    ...newDep,
                    from: detail.selectedOption.value || "",
                  })
                }
                options={components.map((c) => ({
                  label: c.name,
                  value: c.name,
                }))}
                placeholder="From"
                ariaLabel="From"
              />
              <span>→</span>
              <Select
                selectedOption={
                  components.find((c) => c.name === newDep.to)
                    ? { label: newDep.to, value: newDep.to }
                    : { label: "", value: "" }
                }
                onChange={({ detail }) =>
                  setNewDep({
                    ...newDep,
                    to: detail.selectedOption.value || "",
                  })
                }
                options={components.map((c) => ({
                  label: c.name,
                  value: c.name,
                }))}
                placeholder="To"
                ariaLabel="To"
              />
              <Button
                onClick={handleAddDep}
                variant="primary"
                iconName="add-plus"
              >
                Add
              </Button>
            </div>
          </SpaceBetween>
        </Container>
        <Container header={<Header variant="h2">Wardley Map Summary</Header>}>
          <ReactMarkdown>{generateSummary()}</ReactMarkdown>
          <div style={{ marginTop: 24 }}>
            <Button onClick={() => setShowDiagram((v) => !v)}>
              {showDiagram ? "Hide Diagram" : "Draw Wardley Diagram"}
            </Button>
          </div>
          {showDiagram && (
            <div
              style={{
                height: 400,
                marginTop: 24,
                background: "#f8f9fa",
                borderRadius: 8,
              }}
            >
              <ReactFlow nodes={nodes} edges={edges} fitView>
                <MiniMap />
                <Controls />
                <Background gap={16} color="#eee" />
              </ReactFlow>
            </div>
          )}
        </Container>
      </SpaceBetween>
    </ContentLayout>
  );
}
