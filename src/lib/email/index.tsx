//@ts-nocheck
import nodemailer from "nodemailer";
import { render } from "@react-email/components";
import VerificationTemplate from "./templates/verification";
import * as dotenv from "dotenv";

dotenv.config();
interface VerificationOptions {
  token: string;
  email: string;
  callback: string;
  name: string;
}

export async function sendVerificationEmail({
  token,
  email,
  callback,
  name
}: VerificationOptions) {
  const html = await render(
    <VerificationTemplate
      appName={"Recipe app"}
      userName={name}
      userEmail={email}
      verifyUrl={`${1}?q=${token}&callback=${callback}`}
      expiryMinutes={30}
    />
  );

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_AUTH_USERNAME!,
      pass: process.env.EMAIL_AUTH_PASSWORD!,
    },
  });
  const mailOptions = {
    from: process.env.EMAIL_AUTH_USERNAME!,
    to: options.email,
    subject: `Verify your email.`,
    html,
  };
  await transporter.sendMail(mailOptions);
}
