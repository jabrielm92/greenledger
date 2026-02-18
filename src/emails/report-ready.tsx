import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface ReportReadyEmailProps {
  userName: string;
  reportTitle: string;
  frameworkType: string;
  reportId: string;
  sectionsCompleted: number;
  dataPointsCovered: number;
  appUrl?: string;
}

export default function ReportReadyEmail({
  userName,
  reportTitle,
  frameworkType,
  reportId,
  sectionsCompleted,
  dataPointsCovered,
  appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://app.greenledger.com",
}: ReportReadyEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>
        Your {frameworkType} report is ready for review
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>Report Ready for Review</Heading>

          <Text style={text}>Hi {userName},</Text>

          <Text style={text}>
            Your sustainability report has been generated and is ready for
            review.
          </Text>

          <Section style={reportCard}>
            <Text style={reportTitle_}>
              {reportTitle}
            </Text>
            <Text style={reportMeta}>
              Framework: {frameworkType}
            </Text>
            <Section style={statsRow}>
              <Text style={stat}>
                <span style={statValue}>{sectionsCompleted}</span>
                <br />
                Sections
              </Text>
              <Text style={stat}>
                <span style={statValue}>{dataPointsCovered}</span>
                <br />
                Data Points
              </Text>
            </Section>
          </Section>

          <Section style={buttonSection}>
            <Button
              style={button}
              href={`${appUrl}/dashboard/reports/${reportId}`}
            >
              Review Your Report
            </Button>
          </Section>

          <Text style={text}>
            You can edit any section, add manual annotations, and export to
            PDF once you&apos;re satisfied with the content.
          </Text>

          <Hr style={hr} />

          <Text style={footer}>
            — The GreenLedger Team
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "40px 24px",
  maxWidth: "560px",
  borderRadius: "8px",
};

const heading = {
  color: "#059669",
  fontSize: "24px",
  fontWeight: "bold" as const,
  marginBottom: "24px",
};

const text = {
  color: "#374151",
  fontSize: "14px",
  lineHeight: "24px",
  marginBottom: "12px",
};

const reportCard = {
  backgroundColor: "#f0fdf4",
  borderRadius: "8px",
  padding: "20px",
  marginBottom: "20px",
  border: "1px solid #bbf7d0",
};

const reportTitle_ = {
  color: "#166534",
  fontSize: "16px",
  fontWeight: "bold" as const,
  marginBottom: "4px",
};

const reportMeta = {
  color: "#4ade80",
  fontSize: "12px",
  marginBottom: "12px",
};

const statsRow = {
  display: "flex" as const,
  gap: "24px",
};

const stat = {
  color: "#374151",
  fontSize: "12px",
  textAlign: "center" as const,
};

const statValue = {
  fontSize: "20px",
  fontWeight: "bold" as const,
  color: "#059669",
};

const buttonSection = {
  textAlign: "center" as const,
  marginBottom: "20px",
};

const button = {
  backgroundColor: "#059669",
  borderRadius: "6px",
  color: "#ffffff",
  fontSize: "14px",
  fontWeight: "bold" as const,
  padding: "12px 24px",
  textDecoration: "none" as const,
};

const hr = {
  borderColor: "#e5e7eb",
  marginTop: "24px",
  marginBottom: "16px",
};

const footer = {
  color: "#9ca3af",
  fontSize: "12px",
  lineHeight: "20px",
};
