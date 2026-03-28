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

interface TrialExpiringEmailProps {
  userName: string;
  organizationName: string;
  daysRemaining: number;
  trialEndsAt: string;
  appUrl?: string;
}

export default function TrialExpiringEmail({
  userName,
  organizationName,
  daysRemaining,
  trialEndsAt,
  appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://app.greenledger.com",
}: TrialExpiringEmailProps) {
  const isLastDay = daysRemaining <= 1;

  return (
    <Html>
      <Head />
      <Preview>
        {isLastDay
          ? "Your GreenLedger trial ends today"
          : `Your GreenLedger trial ends in ${daysRemaining} days`}
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>
            {isLastDay
              ? "Your Trial Ends Today"
              : `Your Trial Ends in ${daysRemaining} Days`}
          </Heading>

          <Text style={text}>Hi {userName},</Text>

          <Text style={text}>
            The free trial for <strong>{organizationName}</strong> on GreenLedger
            {isLastDay
              ? " expires today."
              : ` expires on ${trialEndsAt}.`}
          </Text>

          <Text style={text}>
            After your trial ends, you'll still have a 7-day grace period to view
            your data, but you won't be able to create or edit documents, emissions,
            or reports until you upgrade.
          </Text>

          <Section style={featureBox}>
            <Text style={featureTitle}>Keep access to:</Text>
            <Text style={featureItem}>AI-powered document extraction</Text>
            <Text style={featureItem}>Automated emissions calculations</Text>
            <Text style={featureItem}>CSRD & GRI compliance reports</Text>
            <Text style={featureItem}>Supplier ESG assessments</Text>
          </Section>

          <Section style={buttonSection}>
            <Button
              style={button}
              href={`${appUrl}/dashboard/settings/billing`}
            >
              Upgrade Now — Starting at $249/mo
            </Button>
          </Section>

          <Text style={text}>
            Have questions? Reply to this email — we're happy to help you find
            the right plan for {organizationName}.
          </Text>

          <Hr style={hr} />

          <Text style={footer}>
            You're receiving this because you started a free trial on GreenLedger.
            You can manage notification preferences in your dashboard settings.
          </Text>

          <Text style={footer}>— The GreenLedger Team</Text>
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

const featureBox = {
  backgroundColor: "#f0fdf4",
  borderRadius: "8px",
  padding: "16px 20px",
  marginBottom: "20px",
  border: "1px solid #bbf7d0",
};

const featureTitle = {
  color: "#059669",
  fontSize: "14px",
  fontWeight: "bold" as const,
  marginBottom: "8px",
};

const featureItem = {
  color: "#374151",
  fontSize: "13px",
  lineHeight: "22px",
  marginBottom: "2px",
  paddingLeft: "12px",
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
