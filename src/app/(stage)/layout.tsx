"use client";

import React, { useEffect, useMemo } from "react";
import {
  AppLayout,
  BreadcrumbGroup,
  Flashbar,
  HelpPanel,
  SplitPanel,
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

const LOCALE = "en";

function AppLayoutContent({ children }: { children: React.ReactNode }) {
  const { helpPanel, notifications, splitPanel, splitPanelOpen } =
    useAppLayout();
  const router = useRouter();
  const pathname = usePathname();

  // 현재 경로에 따른 Breadcrumb 생성
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

  return (
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
