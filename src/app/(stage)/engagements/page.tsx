"use client";

import React, { useState, useEffect, Suspense } from "react";
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
  ColumnLayout,
  StatusIndicator,
  Grid,
  Badge,
  Link,
} from "@cloudscape-design/components";
import { useAppLayout } from "@/app/context/AppLayoutContext";
import dynamic from "next/dynamic";
import {
  SAMPLE_ENGAGEMENTS,
  Engagement,
  EngagementType,
} from "@/app/data/engagements";

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

// ProgressBar를 클라이언트 사이드에서만 렌더링하도록 설정
const ClientProgressBar = dynamic(() => Promise.resolve(ProgressBar), {
  ssr: false,
});

// 기본 테이블 환경설정
const DEFAULT_PREFERENCES = {
  pageSize: 10,
  visibleContent: [
    "id",
    "companyName",
    "engagementName",
    "sfdcId",
    "engagementType",
    "progress",
    "actions",
  ],
};

// URL 쿼리 파라미터를 사용하는 컴포넌트는 별도의 파일로 분리
// 클라이언트 컴포넌트로 lazy 로드
const EngagementParamHandler = dynamic(
  () => import("@/app/(stage)/engagements/EngagementParamHandler"),
  {
    ssr: false,
  }
);

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
      // 진행 상태에 따른 상태 표시
      const getProgressStatus = (progress: number) => {
        if (progress < 30) return "pending";
        if (progress < 70) return "in-progress";
        if (progress < 100) return "success";
        return "success";
      };

      // 프로젝트 타입에 따른 뱃지 색상
      const getProjectTypeBadge = (type: EngagementType) => {
        if (type === EngagementType.BLA) {
          return <Badge color="blue">{type}</Badge>;
        } else {
          return <Badge color="green">{type}</Badge>;
        }
      };

      // 날짜 포맷 함수
      const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("ko-KR", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      };

      // 프로젝트 기간 계산
      const calculateDuration = (startDate: string, endDate: string) => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
      };

      setSplitPanel({
        header: `Engagement Details - ${selectedRow.engagementName}`,
        i18nStrings: {
          preferencesTitle: "Split panel preferences",
          preferencesPositionLabel: "Split panel position",
          preferencesPositionDescription: "Choose the split panel position.",
          preferencesPositionSide: "Side",
          preferencesPositionBottom: "Bottom",
          preferencesConfirm: "Confirm",
          preferencesCancel: "Cancel",
          closeButtonAriaLabel: "Close panel",
          resizeHandleAriaLabel: "Resize split panel",
        },
        children: (
          <Container>
            <SpaceBetween size="l">
              {/* 요약 정보 */}
              <Box variant="h4">
                {selectedRow.companyName} - {selectedRow.engagementName}
              </Box>

              <Grid gridDefinition={[{ colspan: 12 }]}>
                <StatusIndicator type={getProgressStatus(selectedRow.progress)}>
                  진행 상태: {selectedRow.progress}% 완료
                </StatusIndicator>
              </Grid>

              {/* 프로젝트 정보 */}
              <ColumnLayout columns={2} variant="text-grid">
                <SpaceBetween size="m">
                  <div>
                    <Box variant="awsui-key-label">Engagement ID</Box>
                    <Box>{selectedRow.id}</Box>
                  </div>
                  <div>
                    <Box variant="awsui-key-label">SFDC ID</Box>
                    <Box>{selectedRow.sfdcId}</Box>
                  </div>
                  <div>
                    <Box variant="awsui-key-label">프로젝트 유형</Box>
                    <Box>{getProjectTypeBadge(selectedRow.engagementType)}</Box>
                  </div>
                </SpaceBetween>

                <SpaceBetween size="m">
                  <div>
                    <Box variant="awsui-key-label">시작일</Box>
                    <Box>{formatDate(selectedRow.startDate)}</Box>
                  </div>
                  <div>
                    <Box variant="awsui-key-label">종료일</Box>
                    <Box>{formatDate(selectedRow.endDate)}</Box>
                  </div>
                  <div>
                    <Box variant="awsui-key-label">총 프로젝트 기간</Box>
                    <Box>
                      {calculateDuration(
                        selectedRow.startDate,
                        selectedRow.endDate
                      )}
                      일
                    </Box>
                  </div>
                </SpaceBetween>
              </ColumnLayout>

              {/* 진행률 표시 */}
              <Box variant="h5">진행 상황</Box>
              <Box padding={{ bottom: "s" }}>
                <ClientProgressBar
                  value={selectedRow.progress}
                  label={`${selectedRow.progress}%`}
                  description={
                    selectedRow.progress === 100 ? "완료됨" : "진행 중"
                  }
                  status={
                    selectedRow.progress < 30
                      ? "in-progress"
                      : selectedRow.progress < 70
                      ? "in-progress"
                      : "success"
                  }
                />
              </Box>

              {/* 액션 버튼 */}
              <SpaceBetween direction="horizontal" size="xs">
                <Button variant="primary">상세 보기</Button>
                <Button variant="normal">편집</Button>
                <Button variant="link">보고서 다운로드</Button>
              </SpaceBetween>
            </SpaceBetween>
          </Container>
        ),
      });
      setSplitPanelOpen(true); // SplitPanel 열기
    } else {
      setSplitPanel(null);
      setSplitPanelOpen(false); // SplitPanel 닫기
    }
  }, [selectedRow, setSplitPanel, setSplitPanelOpen]);

  // Table의 onSelectionChange 핸들러 추가
  const handleTableSelectionChange = (e: { detail: { selectedItems: Engagement[] } }) => {
    const selected = e.detail.selectedItems;
    setSelectedItems(selected);
    if (selected.length > 0) {
      setSelectedRow(selected[0]);
    } else {
      setSelectedRow(null);
    }
  };

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

  // 테이블 컬럼 정의
  const columnDefinitions = [
    {
      id: "id",
      header: "Engagement ID",
      cell: (item: Engagement) => item.id,
      sortingField: "id",
    },
    {
      id: "companyName",
      header: "Company Name",
      cell: (item: Engagement) => item.companyName,
      sortingField: "companyName",
    },
    {
      id: "engagementName",
      header: "Project Name",
      cell: (item: Engagement) => (
        <Link
          onFollow={(e) => {
            e.preventDefault();
            setSelectedRow(item);
          }}
        >
          {item.engagementName}
        </Link>
      ),
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
      cell: (item: Engagement) => (
        <SpaceBetween direction="horizontal" size="xs">
          <Button
            variant="link"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedRow(item);
            }}
          >
            상세보기
          </Button>
          <Button
            variant="link"
            onClick={(e) => {
              e.stopPropagation();
              moveToRandomNavigation();
            }}
          >
            이동
          </Button>
        </SpaceBetween>
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
      <Suspense fallback={null}>
        <EngagementParamHandler onSelectEngagement={setSelectedRow} />
      </Suspense>
      <Box>
        <Container>
          {mounted && (
            <Table
              columnDefinitions={columnDefinitions}
              items={paginatedItems}
              loading={false}
              loadingText="데이터 로드 중"
              selectionType="single"
              selectedItems={selectedItems}
              onSelectionChange={handleTableSelectionChange}
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
                          { id: "id", label: "Engagement ID" },
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
