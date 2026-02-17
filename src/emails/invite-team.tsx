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

interface InviteTeamEmailProps {
  inviterName: string;
  companyName: string;
  role: string;
  inviteToken: string;
  appUrl?: string;
}

export default function InviteTeamEmail({
  inviterName,
  companyName,
  role,
  inviteToken,
  appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://app.greenledger.com",
}: InviteTeamEmailProps) {
  const acceptUrl = `${appUrl}/invite/${inviteToken}`;

  return (
    <Html>
      <Head />
      <Preview>
        You&apos;ve been invited to join {companyName} on GreenLedger
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>Team Invitation</Heading>

          <Text style={text}>
            <strong>{inviterName}</strong> has invited you to join{" "}
            <strong>{companyName}</strong> on GreenLedger.
          </Text>

          <Section style={roleCard}>
            <Text style={roleLabel}>Your Role</Text>
            <Text style={roleValue}>{formatRole(role)}</Text>
            <Text style={roleDescription}>
              {getRoleDescription(role)}
            </Text>
          </Section>

          <Text style={text}>
            GreenLedger helps organizations track emissions, manage ESG
            compliance, and generate sustainability reports.
          </Text>

          <Section style={buttonSection}>
            <Button style={button} href={acceptUrl}>
              Accept Invitation
            </Button>
          </Section>

          <Text style={smallText}>
            This invitation will expire in 7 days. If you don&apos;t recognize
            this invitation, you can safely ignore this email.
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

function formatRole(role: string): string {
  switch (role) {
    case "ADMIN":
      return "Admin";
    case "ANALYST":
      return "Analyst";
    case "VIEWER":
      return "Viewer";
    default:
      return role;
  }
}

function getRoleDescription(role: string): string {
  switch (role) {
    case "ADMIN":
      return "Full access to all features, settings, and team management.";
    case "ANALYST":
      return "Can upload documents, manage emissions data, and generate reports.";
    case "VIEWER":
      return "Read-only access to dashboards and reports.";
    default:
      return "";
  }
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

const smallText = {
  color: "#6b7280",
  fontSize: "12px",
  lineHeight: "20px",
  marginBottom: "12px",
};

const roleCard = {
  backgroundColor: "#f0fdf4",
  borderRadius: "8px",
  padding: "16px",
  marginBottom: "20px",
  border: "1px solid #bbf7d0",
  textAlign: "center" as const,
};

const roleLabel = {
  color: "#6b7280",
  fontSize: "11px",
  textTransform: "uppercase" as const,
  letterSpacing: "0.5px",
  marginBottom: "4px",
};

const roleValue = {
  color: "#059669",
  fontSize: "18px",
  fontWeight: "bold" as const,
  marginBottom: "4px",
};

const roleDescription = {
  color: "#374151",
  fontSize: "13px",
  marginBottom: "0",
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
