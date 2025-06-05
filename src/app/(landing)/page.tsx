"use client";

import * as React from "react";
import Image from "next/image";
import ContentLayout from "@cloudscape-design/components/content-layout";
import Container from "@cloudscape-design/components/container";
import Header from "@cloudscape-design/components/header";
import SpaceBetween from "@cloudscape-design/components/space-between";
import Button from "@cloudscape-design/components/button";
import Box from "@cloudscape-design/components/box";
import Grid from "@cloudscape-design/components/grid";
import ColumnLayout from "@cloudscape-design/components/column-layout";
import TextContent from "@cloudscape-design/components/text-content";
import Badge from "@cloudscape-design/components/badge";
import Icon from "@cloudscape-design/components/icon";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();

  return (
    <ContentLayout
      defaultPadding
      header={
        <SpaceBetween size="m">
          <Header
            variant="h1"
            description="Next-generation product development process management platform"
            actions={
              <SpaceBetween size="xs" direction="horizontal">
                <Button onClick={() => router.push("/login")}>Login</Button>
                <Button
                  variant="primary"
                  onClick={() =>
                    router.push(
                      "/product-team/identify/business-goal-alignment"
                    )
                  }
                >
                  Get Started for Free
                </Button>
              </SpaceBetween>
            }
          >
            <Box fontSize="heading-xl" fontWeight="heavy">
              UpsideDown
            </Box>
          </Header>
        </SpaceBetween>
      }
    >
      <SpaceBetween size="l">
        {/* Hero Section with Image */}
        <Container>
          <div
            style={{
              position: "relative",
              overflow: "hidden",
              borderRadius: "8px",
            }}
          >
            <Image
              src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2940&auto=format&fit=crop"
              alt="Team collaboration"
              width={2940}
              height={400}
              style={{
                width: "100%",
                height: "400px",
                objectFit: "cover",
                opacity: 0.9,
              }}
            />
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "100%",
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                borderRadius: "8px",
                maxWidth: "800px",
              }}
            >
              <Box
                textAlign="center"
                padding={{ vertical: "xl", horizontal: "l" }}
              >
                <SpaceBetween size="l">
                  <Box fontSize="display-l" fontWeight="light">
                    Manage every step of product development{" "}
                    <Box variant="strong">systematically</Box>
                  </Box>
                  <TextContent>
                    <p>
                      From business goal alignment to development cycles, all
                      teams collaborate on one platform to create innovative
                      products.
                    </p>
                  </TextContent>
                  <Box>
                    <Button
                      variant="primary"
                      iconName="external"
                      onClick={() =>
                        router.push(
                          "/product-team/identify/business-goal-alignment"
                        )
                      }
                    >
                      Start 30-day Free Trial
                    </Button>
                  </Box>
                </SpaceBetween>
              </Box>
            </div>
          </div>
        </Container>

        {/* Key Features */}
        <Container
          header={
            <Header
              variant="h2"
              description="Key features to maximize your team's productivity"
            >
              Key Features
            </Header>
          }
        >
          <ColumnLayout columns={3} variant="text-grid">
            <div>
              <SpaceBetween size="xs">
                <Box variant="h3">
                  <Icon name="search" /> Customer Discovery
                </Box>
                <Box variant="p">
                  Tools to discover real customer needs, such as Customer
                  Journey Map, Experience Map, Value Stream Identification, etc.
                </Box>
              </SpaceBetween>
            </div>
            <div>
              <SpaceBetween size="xs">
                <Box variant="h3">
                  <Icon name="settings" /> Systematic Design
                </Box>
                <Box variant="p">
                  Data-driven product design process from hypothesis building,
                  prototyping, to metric setting.
                </Box>
              </SpaceBetween>
            </div>
            <div>
              <SpaceBetween size="xs">
                <Box variant="h3">
                  <Icon name="status-positive" /> Agile Development
                </Box>
                <Box variant="p">
                  Integrated support for the latest agile methodologies such as
                  Event Storming, Story Workshop, LRP, etc.
                </Box>
              </SpaceBetween>
            </div>
          </ColumnLayout>
        </Container>

        {/* Visual Section with Statistics */}
        <Grid
          gridDefinition={[
            { colspan: { default: 12, s: 6 } },
            { colspan: { default: 12, s: 6 } },
          ]}
        >
          <Container>
            <Image
              src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop"
              alt="Data analytics dashboard"
              width={2426}
              height={300}
              style={{
                width: "100%",
                height: "300px",
                objectFit: "cover",
                borderRadius: "8px",
              }}
            />
          </Container>
          <Container
            header={<Header variant="h2">Data-driven Decision Making</Header>}
          >
            <SpaceBetween size="m">
              <TextContent>
                <p>
                  Measure product performance with real-time dashboards and
                  analytics tools, and make quick decisions based on data.
                </p>
                <ul>
                  <li>Real-time KPI Monitoring</li>
                  <li>Customizable Dashboard</li>
                  <li>Automated Report Generation</li>
                  <li>Team Performance Analysis</li>
                </ul>
              </TextContent>
            </SpaceBetween>
          </Container>
        </Grid>

        {/* Benefits */}
        <Container
          header={
            <Header variant="h2" description="Grow with UpsideDown">
              Impact
            </Header>
          }
        >
          <Grid
            gridDefinition={[
              { colspan: { default: 12, s: 6 } },
              { colspan: { default: 12, s: 6 } },
              { colspan: { default: 12, s: 6 } },
              { colspan: { default: 12, s: 6 } },
            ]}
          >
            <Container>
              <SpaceBetween size="xs">
                <Box variant="h3" color="text-status-success">
                  40% Faster
                </Box>
                <Box variant="p">Time to Market</Box>
              </SpaceBetween>
            </Container>
            <Container>
              <SpaceBetween size="xs">
                <Box variant="h3" color="text-status-success">
                  3x Improvement
                </Box>
                <Box variant="p">Team Collaboration Efficiency</Box>
              </SpaceBetween>
            </Container>
            <Container>
              <SpaceBetween size="xs">
                <Box variant="h3" color="text-status-success">
                  85% Reduction
                </Box>
                <Box variant="p">Project Risk</Box>
              </SpaceBetween>
            </Container>
            <Container>
              <SpaceBetween size="xs">
                <Box variant="h3" color="text-status-success">
                  2x Increase
                </Box>
                <Box variant="p">Customer Satisfaction</Box>
              </SpaceBetween>
            </Container>
          </Grid>
        </Container>

        {/* Use Cases */}
        <Container
          header={
            <Header
              variant="h2"
              description="Various teams are using UpsideDown"
            >
              Use Cases
            </Header>
          }
        >
          <SpaceBetween size="l">
            <ColumnLayout columns={2}>
              <Container>
                <SpaceBetween size="s">
                  <Badge>Product Team</Badge>
                  <Box variant="h3">Product Planning Team</Box>
                  <TextContent>
                    <p>
                      Accurately identify business goals and customer needs, and
                      make data-driven decisions.
                    </p>
                    <ul>
                      <li>Business Goal Alignment</li>
                      <li>Customer Experience Map</li>
                      <li>Service Blueprint</li>
                    </ul>
                  </TextContent>
                </SpaceBetween>
              </Container>
              <Container>
                <SpaceBetween size="s">
                  <Badge>Product Management</Badge>
                  <Box variant="h3">Product Management</Box>
                  <TextContent>
                    <p>
                      Manage the entire product lifecycle, from hypothesis
                      validation to performance measurement.
                    </p>
                    <ul>
                      <li>Hypothesis Building Workshop</li>
                      <li>Prototyping & Validation</li>
                      <li>PR/FAQ & 1-Pagers</li>
                    </ul>
                  </TextContent>
                </SpaceBetween>
              </Container>
            </ColumnLayout>
            <Container>
              <SpaceBetween size="s">
                <Badge>Product Development</Badge>
                <Box variant="h3">Development Team</Box>
                <TextContent>
                  <p>
                    Leverage the latest agile methodologies for fast and
                    efficient development.
                  </p>
                  <ul>
                    <li>Domain modeling with Event Storming</li>
                    <li>Requirements definition with Story Workshop</li>
                    <li>Long-term roadmap with LRP</li>
                  </ul>
                </TextContent>
              </SpaceBetween>
            </Container>
          </SpaceBetween>
        </Container>

        {/* Customer Testimonials */}
        <Container
          header={
            <Header variant="h2" description="Real user testimonials">
              Testimonials
            </Header>
          }
        >
          <ColumnLayout columns={3}>
            <Container>
              <SpaceBetween size="xs">
                <Box variant="p">
                  {'"'}After implementing UpsideDown, the productivity of the
                  entire team has significantly improved.{'"'}
                </Box>
                <Box variant="small">- Kim Hyun-su, CTO @ Tech Startup</Box>
              </SpaceBetween>
            </Container>
            <Container>
              <SpaceBetween size="xs">
                <Box variant="p">
                  {'"'}Everyone can work towards the same direction, and the
                  speed of customer feedback reflection has increased three
                  times.{'"'}
                </Box>
                <Box variant="small">
                  - Park Ji-young, Product Manager @ FinTech Company
                </Box>
              </SpaceBetween>
            </Container>
            <Container>
              <SpaceBetween size="xs">
                <Box variant="p">
                  {'"'}We could manage complex projects without risk thanks to
                  the systematic process of UpsideDown.{'"'}
                </Box>
                <Box variant="small">
                  - Lee Jun-ho, VP of Product @ Ecommerce
                </Box>
              </SpaceBetween>
            </Container>
          </ColumnLayout>
        </Container>

        {/* Pricing */}
        <Container
          header={
            <Header
              variant="h2"
              description="Choose a plan that fits your team size"
            >
              Pricing
            </Header>
          }
        >
          <Grid
            gridDefinition={[
              { colspan: { default: 12, s: 4 } },
              { colspan: { default: 12, s: 4 } },
              { colspan: { default: 12, s: 4 } },
            ]}
          >
            <Container>
              <SpaceBetween size="m">
                <Box variant="h3">Starter</Box>
                <Box fontSize="heading-xl">Free</Box>
                <TextContent>
                  <ul>
                    <li>Up to 5 users</li>
                    <li>All basic features included</li>
                    <li>Community support</li>
                  </ul>
                </TextContent>
                <Button fullWidth>Start for Free</Button>
              </SpaceBetween>
            </Container>
            <Container>
              <SpaceBetween size="m">
                <Box variant="h3">
                  <Badge color="blue">Popular</Badge> Professional
                </Box>
                <Box fontSize="heading-xl">₩49,000/mo</Box>
                <TextContent>
                  <ul>
                    <li>Unlimited users</li>
                    <li>Advanced analytics</li>
                    <li>Priority support</li>
                    <li>API access</li>
                  </ul>
                </TextContent>
                <Button variant="primary" fullWidth>
                  30-day Free Trial
                </Button>
              </SpaceBetween>
            </Container>
            <Container>
              <SpaceBetween size="m">
                <Box variant="h3">Enterprise</Box>
                <Box fontSize="heading-xl">Custom Quote</Box>
                <TextContent>
                  <ul>
                    <li>All Professional features</li>
                    <li>Dedicated success manager</li>
                    <li>On-premise installation</li>
                    <li>Custom training</li>
                  </ul>
                </TextContent>
                <Button fullWidth>Contact Sales</Button>
              </SpaceBetween>
            </Container>
          </Grid>
        </Container>

        {/* CTA Section */}
        <Container>
          <Box textAlign="center" padding={{ vertical: "xl" }}>
            <SpaceBetween size="l">
              <Box fontSize="heading-xl">
                Start now and experience innovation in product development
              </Box>
              <SpaceBetween
                size="xs"
                direction="horizontal"
                alignItems="center"
              >
                <Button
                  variant="primary"
                  iconName="external"
                  onClick={() =>
                    router.push(
                      "/product-team/identify/business-goal-alignment"
                    )
                  }
                >
                  Start 30-day Free Trial
                </Button>
                <Box variant="span">No credit card required</Box>
              </SpaceBetween>
            </SpaceBetween>
          </Box>
        </Container>
      </SpaceBetween>
    </ContentLayout>
  );
}
