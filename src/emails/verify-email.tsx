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

interface VerifyEmailProps {
  userName: string;
  verifyUrl: string;
}

export default function VerifyEmail({
  userName,
  verifyUrl,
}: VerifyEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Verify your GreenLedger email address</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>Verify Your Email</Heading>

          <Text style={text}>Hi {userName},</Text>

          <Text style={text}>
            Thanks for signing up for GreenLedger! Please verify your email
            address by clicking the button below.
          </Text>

          <Section style={buttonSection}>
            <Button style={button} href={verifyUrl}>
              Verify Email Address
            </Button>
          </Section>

          <Text style={text}>
            If the button above doesn&apos;t work, copy and paste the following
            URL into your browser:
          </Text>

          <Text style={urlText}>{verifyUrl}</Text>

          <Hr style={hr} />

          <Text style={footer}>
            If you didn&apos;t create a GreenLedger account, you can safely
            ignore this email.
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

const urlText = {
  color: "#059669",
  fontSize: "12px",
  lineHeight: "20px",
  marginBottom: "12px",
  wordBreak: "break-all" as const,
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
