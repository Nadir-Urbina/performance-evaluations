import * as React from 'react';
import {
  Html,
  Body,
  Head,
  Heading,
  Hr,
  Container,
  Preview,
  Section,
  Text,
  Link,
  Button,
} from '@react-email/components';

interface WelcomeEmailProps {
  userName: string;
  organizationName: string;
}

export const WelcomeEmail = ({
  userName = 'John',
  organizationName = 'ACME Corp',
}: WelcomeEmailProps) => {
  const previewText = `Welcome to Simple Evaluation, ${userName}!`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Welcome to Simple Evaluation</Heading>
          <Text style={text}>
            Hello {userName},
          </Text>
          <Text style={text}>
            Thank you for signing up for Simple Evaluation! We're excited to have you and {organizationName} on board.
          </Text>
          <Text style={text}>
            With Simple Evaluation, you can easily create custom performance evaluations, manage approval flows, and gain valuable insights to help your team succeed.
          </Text>
          <Section style={buttonContainer}>
            <Button
              style={button}
              href="https://simpleevaluation.com/dashboard"
            >
              Get Started
            </Button>
          </Section>
          <Text style={text}>
            Here are a few things you can do to get started:
          </Text>
          <ul>
            <li style={listItem}>Upload your employee data</li>
            <li style={listItem}>Create job functions for your organization</li>
            <li style={listItem}>Add evaluation questions and criteria</li>
            <li style={listItem}>Set up your approval workflow</li>
            <li style={listItem}>Schedule your first evaluation period</li>
          </ul>
          <Text style={text}>
            If you have any questions or need assistance, please don't hesitate to reach out to our support team.
          </Text>
          <Text style={text}>
            Best regards,<br />
            The Simple Evaluation Team
          </Text>
          <Hr style={hr} />
          <Text style={footer}>
            © {new Date().getFullYear()} Simple Evaluation. All rights reserved.
            <br />
            <Link href="https://simpleevaluation.com/terms" style={link}>Terms of Service</Link> | <Link href="https://simpleevaluation.com/privacy" style={link}>Privacy Policy</Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px',
  maxWidth: '600px',
  borderRadius: '4px',
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
};

const h1 = {
  color: '#1d4ed8',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '30px 0',
  padding: '0',
  lineHeight: '1.5',
};

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '16px 0',
};

const buttonContainer = {
  margin: '24px 0',
  textAlign: 'center' as const,
};

const button = {
  backgroundColor: '#1d4ed8',
  borderRadius: '4px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  margin: '0 auto',
  padding: '12px 20px',
};

const listItem = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '8px 0',
};

const hr = {
  borderColor: '#e6ebf1',
  margin: '20px 0',
};

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '22px',
  marginTop: '12px',
  textAlign: 'center' as const,
};

const link = {
  color: '#1d4ed8',
  textDecoration: 'underline',
};

export default WelcomeEmail; 