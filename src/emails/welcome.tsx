import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface WelcomeEmailProps {
  userName: string;
  appUrl?: string;
}

export default function WelcomeEmail({
  userName,
  appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://app.greenledger.com",
}: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>
        Welcome to GreenLedger — Let&apos;s simplify your ESG compliance
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>Welcome to GreenLedger</Heading>

          <Text style={text}>Hi {userName},</Text>

          <Text style={text}>
            Thank you for signing up for GreenLedger! We&apos;re here to help
            you simplify ESG compliance and sustainability reporting.
          </Text>

          <Text style={text}>
            Here are three quick steps to get started:
          </Text>

          <Section style={stepSection}>
            <Text style={stepNumber}>1</Text>
            <Text style={stepText}>
              <Link href={`${appUrl}/onboarding`} style={link}>
                Complete your company profile
              </Link>
              {" "}— Set up your organization details and reporting preferences.
            </Text>
          </Section>

          <Section style={stepSection}>
            <Text style={stepNumber}>2</Text>
            <Text style={stepText}>
              <Link href={`${appUrl}/dashboard/documents`} style={link}>
                Upload your first document
              </Link>
              {" "}— Our AI will automatically extract emissions data from utility
              bills, invoices, and receipts.
            </Text>
          </Section>

          <Section style={stepSection}>
            <Text style={stepNumber}>3</Text>
            <Text style={stepText}>
              <Link href={`${appUrl}/dashboard/reports/new`} style={link}>
                Generate your first report
              </Link>
              {" "}— Create a CSRD-compliant sustainability report in minutes.
            </Text>
          </Section>

          <Section style={buttonSection}>
            <Button style={button} href={`${appUrl}/dashboard`}>
              Go to Dashboard
            </Button>
          </Section>

          <Hr style={hr} />

          <Text style={footer}>
            If you have questions, reply to this email or visit our{" "}
            <Link href={`${appUrl}/help`} style={link}>
              help center
            </Link>
            .
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

const stepSection = {
  marginBottom: "8px",
  paddingLeft: "8px",
};

const stepNumber = {
  color: "#059669",
  fontSize: "16px",
  fontWeight: "bold" as const,
  display: "inline" as const,
  marginRight: "8px",
};

const stepText = {
  color: "#374151",
  fontSize: "14px",
  lineHeight: "22px",
  display: "inline" as const,
};

const link = {
  color: "#059669",
  textDecoration: "underline" as const,
};

const buttonSection = {
  textAlign: "center" as const,
  marginTop: "24px",
  marginBottom: "24px",
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
