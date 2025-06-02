// 인게이지먼트 유형 정의
export enum EngagementType {
  BLA = "BLA",
  P2P = "P2P",
}

// 인게이지먼트 데이터 타입 정의
export interface Engagement {
  id: string;
  companyName: string;
  engagementName: string;
  sfdcId: string;
  engagementType: EngagementType;
  startDate: string;
  endDate: string;
  progress: number; // 진행도(%)
}

// 샘플 데이터
export const SAMPLE_ENGAGEMENTS: Engagement[] = [
  {
    id: "eng-001",
    companyName: "삼성전자",
    engagementName: "클라우드 마이그레이션",
    sfdcId: "SFDC-12345",
    engagementType: EngagementType.BLA,
    startDate: "2023-01-15",
    endDate: "2023-06-30",
    progress: 80,
  },
  {
    id: "eng-002",
    companyName: "LG CNS",
    engagementName: "데이터 분석 플랫폼 구축",
    sfdcId: "SFDC-23456",
    engagementType: EngagementType.P2P,
    startDate: "2023-02-01",
    endDate: "2023-08-15",
    progress: 60,
  },
  {
    id: "eng-003",
    companyName: "현대자동차",
    engagementName: "AWS 교육 프로그램",
    sfdcId: "SFDC-34567",
    engagementType: EngagementType.BLA,
    startDate: "2023-03-10",
    endDate: "2023-04-10",
    progress: 100,
  },
  {
    id: "eng-004",
    companyName: "SK 텔레콤",
    engagementName: "시스템 유지보수",
    sfdcId: "SFDC-45678",
    engagementType: EngagementType.P2P,
    startDate: "2023-01-01",
    endDate: "2023-12-31",
    progress: 40,
  },
  {
    id: "eng-005",
    companyName: "롯데정보통신",
    engagementName: "클라우드 보안 컨설팅",
    sfdcId: "SFDC-56789",
    engagementType: EngagementType.BLA,
    startDate: "2023-04-01",
    endDate: "2023-07-31",
    progress: 90,
  },
  {
    id: "eng-006",
    companyName: "네이버",
    engagementName: "인프라 최적화",
    sfdcId: "SFDC-67890",
    engagementType: EngagementType.P2P,
    startDate: "2023-05-15",
    endDate: "2023-08-15",
    progress: 30,
  },
  {
    id: "eng-007",
    companyName: "카카오",
    engagementName: "마이크로서비스 아키텍처 구현",
    sfdcId: "SFDC-78901",
    engagementType: EngagementType.BLA,
    startDate: "2023-06-01",
    endDate: "2023-12-31",
    progress: 10,
  },
];
