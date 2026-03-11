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

interface ROICalculatorResultsEmailProps {
  currentCost: number;
  greenLedgerCost: number;
  savings: number;
  percentageSaved: number;
  hoursSaved: number;
  companySize: string;
  appUrl?: string;
}

export default function ROICalculatorResultsEmail({
  currentCost,
  greenLedgerCost,
  savings,
  percentageSaved,
  hoursSaved,
  companySize,
  appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://app.greenledger.com",
}: ROICalculatorResultsEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>
        Your ESG Compliance Savings: ${savings.toLocaleString()}/year with
        GreenLedger
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>Your ROI Calculator Results</Heading>

          <Text style={text}>
            Thank you for using the GreenLedger ROI Calculator. Here&apos;s your
            personalized savings breakdown for a {companySize} employee company:
          </Text>

          <Section style={resultsBox}>
            <Text style={resultRow}>
              <span style={resultLabel}>Current Annual Cost:</span>{" "}
              <span style={resultValue}>
                ${currentCost.toLocaleString()}
              </span>
            </Text>
            <Text style={resultRow}>
              <span style={resultLabel}>GreenLedger Cost:</span>{" "}
              <span style={resultValueGreen}>
                ${greenLedgerCost.toLocaleString()}/year
              </span>
            </Text>
            <Hr style={hrLight} />
            <Text style={resultRow}>
              <span style={resultLabel}>You Save:</span>{" "}
              <span style={savingsValue}>
                ${savings.toLocaleString()}/year ({percentageSaved}% reduction)
              </span>
            </Text>
            <Text style={resultRow}>
              <span style={resultLabel}>Hours Saved:</span>{" "}
              <span style={resultValue}>
                ~{hoursSaved} hours annually
              </span>
            </Text>
          </Section>

          <Text style={text}>
            With GreenLedger, you get:
          </Text>

          <Text style={bulletPoint}>
            ✓ AI-powered document extraction (99.2% accuracy)
          </Text>
          <Text style={bulletPoint}>
            ✓ Multi-framework compliance (CSRD, GRI, SASB, ISSB)
          </Text>
          <Text style={bulletPoint}>
            ✓ Audit-ready reports generated in minutes
          </Text>
          <Text style={bulletPoint}>
            ✓ Full source document traceability
          </Text>

          <Section style={buttonSection}>
            <Button
              style={button}
              href={`${appUrl}/register?source=roi-email`}
            >
              Start Your Free Trial
            </Button>
          </Section>

          <Text style={subtext}>
            No credit card required. Set up in 10 minutes.
          </Text>

          <Hr style={hr} />

          <Text style={footer}>
            Questions? Reply to this email or{" "}
            <Link href={`${appUrl}/contact`} style={link}>
              contact our team
            </Link>
            .
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

const resultsBox = {
  backgroundColor: "#f0fdf4",
  borderRadius: "8px",
  padding: "20px",
  marginBottom: "20px",
  border: "1px solid #bbf7d0",
};

const resultRow = {
  color: "#374151",
  fontSize: "14px",
  lineHeight: "28px",
  margin: "0",
};

const resultLabel = {
  fontWeight: "600" as const,
  color: "#374151",
};

const resultValue = {
  color: "#374151",
};

const resultValueGreen = {
  color: "#059669",
  fontWeight: "600" as const,
};

const savingsValue = {
  color: "#059669",
  fontWeight: "bold" as const,
  fontSize: "16px",
};

const hrLight = {
  borderColor: "#bbf7d0",
  marginTop: "8px",
  marginBottom: "8px",
};

const bulletPoint = {
  color: "#374151",
  fontSize: "14px",
  lineHeight: "24px",
  marginBottom: "4px",
  paddingLeft: "8px",
};

const subtext = {
  color: "#9ca3af",
  fontSize: "12px",
  textAlign: "center" as const,
  marginBottom: "16px",
};

const buttonSection = {
  textAlign: "center" as const,
  marginTop: "24px",
  marginBottom: "8px",
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

const link = {
  color: "#059669",
  textDecoration: "underline" as const,
};
