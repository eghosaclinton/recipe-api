import {
  Html,
  Head,
  Heading,
  Preview,
  Container,
  Body,
  Text,
  Button,
} from "@react-email/components";

interface Props {
  appName: string;
  userName: string;
  userEmail: string;
  verifyUrl: string;
  expiryMinutes: number;
}

export default function VerificationTemplate({
  appName,
  userName,
  userEmail,
  verifyUrl,
  expiryMinutes,
}: Props) {
  return (
    <Html lang="en">
      <Head />
      <Preview>Verify your email for {appName}</Preview>
      <Body style={{ backgroundColor: "#0f172a", padding: "20px" }}>
        <Container
          style={{
            backgroundColor: "#fff",
            borderRadius: "12px",
            padding: "16px",
            maxWidth: "600px",
          }}
        >
          <Heading as="h1">Verify your email</Heading>
          <Text>
            Hi {userName}, confirm <strong>{userEmail}</strong> by clicking
            below.
          </Text>
          <Button
            href={verifyUrl}
            style={{
              backgroundColor: "#2563eb",
              color: "#fff",
              padding: "14px 20px",
              borderRadius: "8px",
              textDecoration: "none",
            }}
          >
            Verify Email
          </Button>
          <Text>This expires in {expiryMinutes} minutes.</Text>
        </Container>
      </Body>
    </Html>
  );
}
