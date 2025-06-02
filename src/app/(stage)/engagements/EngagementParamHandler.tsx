"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { SAMPLE_ENGAGEMENTS, Engagement } from "@/app/data/engagements";

interface EngagementParamHandlerProps {
  onSelectEngagement: (engagement: Engagement | null) => void;
}

export default function EngagementParamHandler({
  onSelectEngagement,
}: EngagementParamHandlerProps) {
  const searchParams = useSearchParams();

  useEffect(() => {
    const engagementId = searchParams.get("engagement");
    if (engagementId) {
      const engagement = SAMPLE_ENGAGEMENTS.find(
        (item) => item.id === engagementId
      );
      if (engagement) {
        onSelectEngagement(engagement);
      }
    }
  }, [searchParams, onSelectEngagement]);

  return null;
}
