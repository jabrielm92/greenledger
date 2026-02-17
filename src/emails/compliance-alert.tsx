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

interface ComplianceAlertEmailProps {
  userName: string;
  frameworkType: string;
  deadlineDate: string;
  daysRemaining: number;
  completionPercentage: number;
  missingDataPoints: number;
  appUrl?: string;
}

export default function ComplianceAlertEmail({
  userName,
  frameworkType,
  deadlineDate,
  daysRemaining,
  completionPercentage,
  missingDataPoints,
  appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://app.greenledger.com",
}: ComplianceAlertEmailProps) {
  const urgency =
    daysRemaining <= 7 ? "urgent" : daysRemaining <= 14 ? "warning" : "info";

  return (
    <Html>
      <Head />
      <Preview>
        {daysRemaining} days until your {frameworkType} reporting deadline
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>
            {urgency === "urgent" ? "Urgent: " : ""}Compliance Deadline
            Approaching
          </Heading>

          <Text style={text}>Hi {userName},</Text>

          <Text style={text}>
            Your <strong>{frameworkType}</strong> reporting deadline is in{" "}
            <strong>{daysRemaining} days</strong> ({deadlineDate}).
          </Text>

          <Section
            style={{
              ...alertCard,
              borderColor:
                urgency === "urgent"
                  ? "#fca5a5"
                  : urgency === "warning"
                  ? "#fcd34d"
                  : "#93c5fd",
              backgroundColor:
                urgency === "urgent"
                  ? "#fef2f2"
                  : urgency === "warning"
                  ? "#fffbeb"
                  : "#eff6ff",
            }}
          >
            <Section style={statsRow}>
              <Text style={stat}>
                <span
                  style={{
                    ...statValue,
                    color:
                      urgency === "urgent"
                        ? "#dc2626"
                        : urgency === "warning"
                        ? "#d97706"
                        : "#2563eb",
                  }}
                >
                  {daysRemaining}
                </span>
                <br />
                Days Left
              </Text>
              <Text style={stat}>
                <span style={{ ...statValue, color: "#059669" }}>
                  {completionPercentage}%
                </span>
                <br />
                Complete
              </Text>
              <Text style={stat}>
                <span style={{ ...statValue, color: "#dc2626" }}>
                  {missingDataPoints}
                </span>
                <br />
                Missing Points
              </Text>
            </Section>
          </Section>

          {/* Progress bar */}
          <Section style={progressContainer}>
            <div
              style={{
                ...progressBar,
                width: `${completionPercentage}%`,
              }}
            />
          </Section>

          <Text style={text}>
            {completionPercentage < 50
              ? "You still have significant data gaps to address. We recommend prioritizing the required disclosure sections."
              : completionPercentage < 80
              ? "Good progress! Focus on filling in the remaining data gaps to ensure compliance."
              : "Almost there! A few more data points and your report will be ready for submission."}
          </Text>

          <Section style={buttonSection}>
            <Button style={button} href={`${appUrl}/dashboard`}>
              Complete Your Data
            </Button>
          </Section>

          <Hr style={hr} />

          <Text style={footer}>
            You received this alert because you have an active {frameworkType}{" "}
            reporting obligation. You can adjust notification settings in your{" "}
            dashboard.
          </Text>

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
  color: "#374151",
  fontSize: "22px",
  fontWeight: "bold" as const,
  marginBottom: "24px",
};

const text = {
  color: "#374151",
  fontSize: "14px",
  lineHeight: "24px",
  marginBottom: "12px",
};

const alertCard = {
  borderRadius: "8px",
  padding: "20px",
  marginBottom: "16px",
  border: "1px solid",
};

const statsRow = {
  display: "flex" as const,
  justifyContent: "space-around" as const,
};

const stat = {
  color: "#374151",
  fontSize: "12px",
  textAlign: "center" as const,
};

const statValue = {
  fontSize: "24px",
  fontWeight: "bold" as const,
};

const progressContainer = {
  backgroundColor: "#e5e7eb",
  borderRadius: "9999px",
  height: "8px",
  marginBottom: "16px",
  overflow: "hidden" as const,
};

const progressBar = {
  backgroundColor: "#059669",
  height: "8px",
  borderRadius: "9999px",
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
