import { SideNavigationProps } from "@cloudscape-design/components";

export const navigationConfig: SideNavigationProps = {
  header: {
    href: "#",
    text: "UpsideDown",
  },
  items: [
    {
      type: "section-group",
      title: "Product Team",
      items: [
        {
          type: "section",
          text: "Identify",
          items: [
            {
              type: "link",
              text: "Business Goal Alignment",
              href: "#/product-team/identify/business-goal-alignment",
            },
            {
              type: "link",
              text: "Customer Experience Map",
              href: "#/product-team/identify/customer-experience-map",
            },
          ],
        },
        {
          type: "section",
          text: "Map",
          items: [
            {
              type: "link",
              text: "Service Blueprint",
              href: "#/product-team/map/service-blueprint",
            },
            {
              type: "link",
              text: "Value Stream Identify",
              href: "#/product-team/map/value-stream-identify",
            },
          ],
        },
      ],
    },
    {
      type: "section-group",
      title: "Product Management",
      items: [
        {
          type: "section",
          text: "Discover",
          items: [
            {
              type: "link",
              text: "Customer Journey Map",
              href: "#/product-management/discover/customer-journey-map",
            },
            {
              type: "link",
              text: "Outcome Identification",
              href: "#/product-management/discover/outcome-identification",
            },
          ],
        },
        {
          type: "section",
          text: "Define",
          items: [
            {
              type: "link",
              text: "Hypothesis Building Workshop",
              href: "#/product-management/define/hypothesis-building-workshop",
            },
            {
              type: "link",
              text: "Prototyping",
              href: "#/product-management/define/prototyping",
            },
          ],
        },
        {
          type: "section",
          text: "Validate",
          items: [
            {
              type: "link",
              text: "Measure",
              href: "#/product-management/validate/measure",
            },
            {
              type: "link",
              text: "1-Pagers",
              href: "#/product-management/validate/1-pagers",
            },
          ],
        },
        {
          type: "section",
          text: "Options",
          items: [
            {
              type: "link",
              text: "PR/FAQ(revision)",
              href: "#/product-management/options/pr-faq-revision",
            },
            {
              type: "link",
              text: "Wardley Mapping",
              href: "#/product-management/options/wardley-mapping",
            },
          ],
        },
      ],
    },
    {
      type: "section-group",
      title: "Product Development",
      items: [
        {
          type: "section",
          text: "Develop",
          items: [
            {
              type: "link",
              text: "Event Storming",
              href: "#/product-development/develop/event-storming",
            },
            {
              type: "link",
              text: "Engagement Alignment Workshop",
              href: "#/product-development/develop/engagement-alignment-workshop",
            },
            {
              type: "link",
              text: "Story Wotkshop",
              href: "#/product-development/develop/story-workshop",
            },
            {
              type: "link",
              text: "LRP",
              href: "#/product-development/develop/lrp",
            },
            {
              type: "link",
              text: "Development Cycle",
              href: "#/product-development/develop/development-cycle",
            },
          ],
        },
      ],
    },
  ],
};
