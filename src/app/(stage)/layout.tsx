"use client";

import React, { useEffect, useMemo } from "react";
import {
  AppLayout,
  BreadcrumbGroup,
  Flashbar,
  HelpPanel,
  SplitPanel,
  TopNavigation,
} from "@cloudscape-design/components";
import { I18nProvider } from "@cloudscape-design/components/i18n";
import messages from "@cloudscape-design/components/i18n/messages/all.en";
import CloudscapeProvider from "@/app/components/CloudscapeProvider";
import Navigation from "@/app/components/Navigation";
import {
  AppLayoutProvider,
  useAppLayout,
} from "@/app/context/AppLayoutContext";
import "@cloudscape-design/global-styles/index.css";
import { useRouter, usePathname } from "next/navigation";
import { SAMPLE_ENGAGEMENTS, Engagement } from "@/app/data/engagements";

const LOCALE = "en";

// 진행 중인 Engagement만 필터링하는 함수
const getIncompleteEngagements = () => {
  return SAMPLE_ENGAGEMENTS.filter(
    (engagement: Engagement) => engagement.progress < 100
  ).map((engagement: Engagement) => ({
    label: `${engagement.companyName} - ${engagement.engagementName} (${engagement.progress}%)`,
    value: engagement.id,
    description: `SFDC ID: ${engagement.sfdcId}`,
    tags: [engagement.engagementType],
  }));
};

function AppLayoutContent({ children }: { children: React.ReactNode }) {
  const { helpPanel, notifications, splitPanel, splitPanelOpen } =
    useAppLayout();
  const router = useRouter();
  const pathname = usePathname();
  // selectedEngagement 상태는 사용되지 않으므로 제거
  const breadcrumbs = useMemo(() => {
    const paths = pathname.split("/").filter(Boolean);
    const items = [{ text: "Home", href: "#" }];

    let currentPath = "";
    paths.forEach((path) => {
      currentPath += `/${path}`;
      const text = path
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      items.push({
        text,
        href: `#${currentPath}`,
      });
    });

    return items;
  }, [pathname]);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash) {
        const path = hash.replace("#", "");
        if (path !== pathname) {
          router.push(path);
        }
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    handleHashChange();

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, [router, pathname]);

  const incompleteEngagements = getIncompleteEngagements();

  return (
    <>
      <TopNavigation
        identity={{
          href: "#",
          title: "UpsideDown",
          logo: {
            src: "https://d1.awsstatic.com/logos/aws-logo-lockups/poweredbyaws/PB_AWS_logo_RGB_stacked_REV_SQ.91cd4af40773cbfbd15577a3c2b8a346fe3e8fa2.png",
            alt: "UpsideDown",
          },
        }}
        utilities={[
          {
            type: "menu-dropdown",
            text: "미완료 Engagement",
            iconName: "notification",
            description: `${incompleteEngagements.length}개의 진행 중인 Engagement`,
            onItemClick: () => {
              /* 필요한 경우 구현 */
            },
            items: incompleteEngagements.map((option) => ({
              id: option.value,
              text: option.label,
              description: option.description,
              onItemClick: () => {
                router.push(`/engagements?engagement=${option.value}`);
              },
            })),
          },
          {
            type: "menu-dropdown",
            text: "사용자",
            description: "admin@example.com",
            iconName: "user-profile",
            items: [
              { id: "profile", text: "프로필" },
              { id: "preferences", text: "환경설정" },
              { id: "security", text: "보안" },
              { id: "signout", text: "로그아웃" },
            ],
          },
        ]}
      />
      <AppLayout
        breadcrumbs={<BreadcrumbGroup items={breadcrumbs} />}
        navigationOpen={true}
        navigation={<Navigation />}
        notifications={
          notifications ? <Flashbar items={notifications} /> : undefined
        }
        tools={helpPanel ? <HelpPanel {...helpPanel} /> : undefined}
        toolsHide={false}
        content={children}
        splitPanelOpen={splitPanelOpen}
        splitPanel={splitPanel ? <SplitPanel {...splitPanel} /> : undefined}
      />
    </>
  );
}

export default function StageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <CloudscapeProvider>
      <I18nProvider locale={LOCALE} messages={[messages]}>
        <AppLayoutProvider>
          <AppLayoutContent>{children}</AppLayoutContent>
        </AppLayoutProvider>
      </I18nProvider>
    </CloudscapeProvider>
  );
}
