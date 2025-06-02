"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  ContentLayout,
  Header,
  Pagination,
  SpaceBetween,
  Table,
  TextFilter,
  CollectionPreferences,
  ProgressBar,
} from "@cloudscape-design/components";
import { useAppLayout } from "@/app/context/AppLayoutContext";
import dynamic from "next/dynamic";

// 인게이지먼트 유형 정의 (BLA, P2P로 변경)
enum EngagementType {
  BLA = "BLA",
  P2P = "P2P",
  // 필요시 다른 유형 추가 가능
}

// 인게이지먼트 데이터 타입 정의
interface Engagement {
  id: string;
  companyName: string;
  engagementName: string;
  sfdcId: string;
  engagementType: EngagementType;
  startDate: string;
  endDate: string;
  progress: number; // 진행도(%)
}

// 이벤트 타입 정의
interface FilteringChangeDetail {
  filteringText: string;
}

interface FilteringChangeEvent {
  detail: FilteringChangeDetail;
}

interface PageChangeDetail {
  currentPageIndex: number;
}

interface PageChangeEvent {
  detail: PageChangeDetail;
}

// 샘플 데이터 (engagementType을 BLA, P2P로 변경)
const SAMPLE_ENGAGEMENTS: Engagement[] = [
  {
    id: "eng-001",
    companyName: "삼성전자",
    engagementName: "클라우드 마이그레이션",
    sfdcId: "SFDC-12345",
    engagementType: EngagementType.BLA, // 예시: BLA로 변경
    startDate: "2023-01-15",
    endDate: "2023-06-30",
    progress: 80,
  },
  {
    id: "eng-002",
    companyName: "LG CNS",
    engagementName: "데이터 분석 플랫폼 구축",
    sfdcId: "SFDC-23456",
    engagementType: EngagementType.P2P, // 예시: P2P로 변경
    startDate: "2023-02-01",
    endDate: "2023-08-15",
    progress: 60,
  },
  {
    id: "eng-003",
    companyName: "현대자동차",
    engagementName: "AWS 교육 프로그램",
    sfdcId: "SFDC-34567",
    engagementType: EngagementType.BLA, // 예시: BLA로 변경
    startDate: "2023-03-10",
    endDate: "2023-04-10",
    progress: 100,
  },
  {
    id: "eng-004",
    companyName: "SK 텔레콤",
    engagementName: "시스템 유지보수",
    sfdcId: "SFDC-45678",
    engagementType: EngagementType.P2P, // 예시: P2P로 변경
    startDate: "2023-01-01",
    endDate: "2023-12-31",
    progress: 40,
  },
  {
    id: "eng-005",
    companyName: "롯데정보통신",
    engagementName: "클라우드 보안 컨설팅",
    sfdcId: "SFDC-56789",
    engagementType: EngagementType.BLA, // 예시: BLA로 변경
    startDate: "2023-04-01",
    endDate: "2023-07-31",
    progress: 90,
  },
  {
    id: "eng-006",
    companyName: "네이버",
    engagementName: "인프라 최적화",
    sfdcId: "SFDC-67890",
    engagementType: EngagementType.P2P, // 예시: P2P로 변경
    startDate: "2023-05-15",
    endDate: "2023-08-15",
    progress: 30,
  },
  {
    id: "eng-007",
    companyName: "카카오",
    engagementName: "마이크로서비스 아키텍처 구현",
    sfdcId: "SFDC-78901",
    engagementType: EngagementType.BLA, // 예시: BLA로 변경
    startDate: "2023-06-01",
    endDate: "2023-12-31",
    progress: 10,
  },
];

// ProgressBar를 클라이언트 사이드에서만 렌더링하도록 설정
const ClientProgressBar = dynamic(() => Promise.resolve(ProgressBar), {
  ssr: false,
});

// 기본 테이블 환경설정
const DEFAULT_PREFERENCES = {
  pageSize: 10,
  visibleContent: [
    "companyName",
    "engagementName",
    "sfdcId",
    "engagementType",
    "progress",
    "actions",
  ],
};
export default function EngagementsPage() {
  const { setHelpPanel, setSplitPanel, setSplitPanelOpen } = useAppLayout();
  const [filteredItems, setFilteredItems] =
    useState<Engagement[]>(SAMPLE_ENGAGEMENTS);
  const [filterText, setFilterText] = useState("");
  const [currentPageIndex, setCurrentPageIndex] = useState(1);
  const [preferences, setPreferences] = useState(DEFAULT_PREFERENCES);
  const [selectedItems, setSelectedItems] = useState<Engagement[]>([]);
  const [mounted, setMounted] = useState(false);
  const [selectedRow, setSelectedRow] = useState<Engagement | null>(null);

  // 도움말 패널 및 SplitPanel 정리 로직
  useEffect(() => {
    setHelpPanel(null);
    setSplitPanel(null);
    setSplitPanelOpen(false); // 컴포넌트 마운트 시 SplitPanel 닫기
    return () => {
      setHelpPanel(null);
      setSplitPanel(null);
      setSplitPanelOpen(false);
    };
  }, [setHelpPanel, setSplitPanel, setSplitPanelOpen]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 필터링 로직
  useEffect(() => {
    if (filterText) {
      const filtered = SAMPLE_ENGAGEMENTS.filter(
        (item) =>
          item.companyName.toLowerCase().includes(filterText.toLowerCase()) ||
          item.engagementName
            .toLowerCase()
            .includes(filterText.toLowerCase()) ||
          item.sfdcId.toLowerCase().includes(filterText.toLowerCase()) ||
          item.engagementType.toLowerCase().includes(filterText.toLowerCase())
      );
      setFilteredItems(filtered);
      setCurrentPageIndex(1);
    } else {
      setFilteredItems(SAMPLE_ENGAGEMENTS);
    }
  }, [filterText]);

  // 선택된 행이 변경될 때 SplitPanel 업데이트
  useEffect(() => {
    if (selectedRow) {
      setSplitPanel({
        header: "Engagement Details",
        children: (
          <SpaceBetween size="m">
            <Box>
              <b>Company Name:</b> {selectedRow.companyName}
            </Box>
            <Box>
              <b>Project Name:</b> {selectedRow.engagementName}
            </Box>
            <Box>
              <b>SFDC ID:</b> {selectedRow.sfdcId}
            </Box>
            <Box>
              <b>Project Type:</b> {selectedRow.engagementType}
            </Box>
            <Box>
              <b>Start Date:</b> {selectedRow.startDate}
            </Box>
            <Box>
              <b>End Date:</b> {selectedRow.endDate}
            </Box>
            <Box>
              <b>Progress:</b>{" "}
              <ClientProgressBar value={selectedRow.progress} />
            </Box>
          </SpaceBetween>
        ),
      });
      setSplitPanelOpen(true); // SplitPanel 열기
    } else {
      setSplitPanel(null);
      setSplitPanelOpen(false); // SplitPanel 닫기
    }
  }, [selectedRow, setSplitPanel, setSplitPanelOpen]);

  // 랜덤 네비게이션 메뉴로 이동하는 함수
  const moveToRandomNavigation = () => {
    const navigationItems = [
      "/product-team/identify/business-goal-alignment",
      "/product-team/identify/customer-experience-map",
      "/product-team/map/service-blueprint",
      "/product-team/map/value-stream-identify",
      "/product-management/discover/customer-journey-map",
      "/product-management/discover/outcome-identification",
      "/product-management/define/hypothesis-building-workshop",
      "/product-management/define/prototyping",
      "/product-management/validate/measure",
      "/product-management/validate/1-pagers",
      "/product-management/options/pr-faq-revision",
      "/product-management/options/wardley-mapping",
      "/product-development/infrastructure/onboarding",
      "/product-development/develop/event-storming",
      "/product-development/develop/engagement-alignment-workshop",
      "/product-development/develop/story-workshop",
      "/product-development/develop/lrp",
      "/product-development/develop/development-cycle",
    ];

    const randomIndex = Math.floor(Math.random() * navigationItems.length);
    const randomPath = navigationItems[randomIndex];
    window.location.hash = randomPath;
  };

  // 테이블 상단 도구 영역
  const tableActions = (
    <SpaceBetween direction="horizontal" size="xs">
      <Button variant="primary">Create Engagement</Button>
      <Button disabled={selectedItems.length === 0}>Edit</Button>
      <Button disabled={selectedItems.length === 0}>Delete</Button>
      <Button onClick={moveToRandomNavigation} variant="primary">
        Select
      </Button>
    </SpaceBetween>
  );

  // 필터링 도구 영역
  const filteringProps = {
    filteringPlaceholder: "Search Engagements",
    filteringText: filterText,
    onFilteringChange: (e: FilteringChangeEvent) =>
      setFilterText(e.detail.filteringText),
  };

  // 페이지네이션 계산
  const paginationProps = {
    currentPageIndex: currentPageIndex,
    pagesCount: Math.ceil(filteredItems.length / preferences.pageSize),
    onPageChange: (e: PageChangeEvent) => {
      console.log("Page change event:", e.detail.currentPageIndex); // 디버깅용
      setCurrentPageIndex(e.detail.currentPageIndex);
    },
  };

  // 테이블에 표시될 아이템 계산 (페이지네이션 적용)
  const paginatedItems = filteredItems.slice(
    (currentPageIndex - 1) * preferences.pageSize,
    currentPageIndex * preferences.pageSize
  );

  // Row 클릭 핸들러
  const handleRowClick = (event: { detail: { item: Engagement } }) => {
    setSelectedRow(event.detail.item);
  };

  // 테이블 컬럼 정의
  const columnDefinitions = [
    {
      id: "companyName",
      header: "Company Name",
      cell: (item: Engagement) => item.companyName,
      sortingField: "companyName",
    },
    {
      id: "engagementName",
      header: "Project Name",
      cell: (item: Engagement) => item.engagementName,
      sortingField: "engagementName",
    },
    {
      id: "sfdcId",
      header: "SFDC ID",
      cell: (item: Engagement) => item.sfdcId,
      sortingField: "sfdcId",
    },
    {
      id: "engagementType",
      header: "Project Type",
      cell: (item: Engagement) => item.engagementType,
      sortingField: "engagementType",
    },
    {
      id: "startDate",
      header: "Start Date",
      cell: (item: Engagement) => item.startDate,
      sortingField: "startDate",
    },
    {
      id: "endDate",
      header: "End Date",
      cell: (item: Engagement) => item.endDate,
      sortingField: "endDate",
    },
    {
      id: "progress",
      header: "Progress",
      cell: (item: Engagement) => <ClientProgressBar value={item.progress} />,
      sortingField: "progress",
    },
    {
      id: "actions",
      header: "Actions",
      cell: () => (
        <Button
          variant="link"
          onClick={(e) => {
            e.stopPropagation(); // 이벤트 전파 방지
            moveToRandomNavigation(); // 랜덤한 페이지로 이동
          }}
        >
          이동
        </Button>
      ),
    },
  ];

  return (
    <ContentLayout
      header={
        <Header
          variant="h1"
          description="Manage and view company-specific engagements."
          actions={tableActions}
        >
          Engagements
        </Header>
      }
    >
      <Box>
        <Container>
          {mounted && (
            <Table
              columnDefinitions={columnDefinitions}
              items={paginatedItems}
              loading={false}
              loadingText="데이터 로드 중"
              selectionType="multi"
              selectedItems={selectedItems}
              onSelectionChange={(e) =>
                setSelectedItems(e.detail.selectedItems)
              }
              onRowClick={handleRowClick}
              variant="full-page"
              stickyHeader={true}
              header={
                <Header
                  variant="h2"
                  counter={`(${filteredItems.length})`}
                  actions={
                    <SpaceBetween direction="horizontal" size="xs">
                      <Button iconName="refresh">Refresh</Button>
                      <Button iconName="download">Export</Button>
                    </SpaceBetween>
                  }
                >
                  Engagement List
                </Header>
              }
              filter={
                <TextFilter
                  {...filteringProps}
                  countText={`${filteredItems.length} matches`}
                />
              }
              pagination={<Pagination {...paginationProps} />}
              preferences={
                <CollectionPreferences
                  title="Preferences"
                  confirmLabel="Confirm"
                  cancelLabel="Cancel"
                  preferences={preferences}
                  onConfirm={({ detail }) => {
                    if (detail.pageSize && detail.visibleContent) {
                      setPreferences({
                        pageSize: detail.pageSize,
                        visibleContent: [...detail.visibleContent],
                      });
                    }
                  }}
                  pageSizePreference={{
                    title: "Page size",
                    options: [
                      { value: 10, label: "10 rows" },
                      { value: 20, label: "20 rows" },
                      { value: 50, label: "50 rows" },
                    ],
                  }}
                  visibleContentPreference={{
                    title: "Visible columns",
                    options: [
                      {
                        label: "Engagement Attributes",
                        options: [
                          { id: "companyName", label: "Company Name" },
                          { id: "engagementName", label: "Project Name" },
                          { id: "sfdcId", label: "SFDC ID" },
                          { id: "engagementType", label: "Project Type" },
                          { id: "startDate", label: "Start Date" },
                          { id: "endDate", label: "End Date" },
                          { id: "progress", label: "Progress" },
                        ],
                      },
                    ],
                  }}
                />
              }
              empty={
                <Box textAlign="center" color="inherit">
                  <b>No data</b>
                  <Box padding={{ bottom: "s" }} variant="p" color="inherit">
                    There are no engagements to display in this table.
                  </Box>
                  <Button>Create Engagement</Button>
                </Box>
              }
              visibleColumns={preferences.visibleContent}
            />
          )}
        </Container>
      </Box>
    </ContentLayout>
  );
}
