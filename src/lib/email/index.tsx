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
  name,
}: VerificationOptions) {
  const html = await render(
    <VerificationTemplate
      appName={"Recipe app"}
      userName={name}
      userEmail={email}
      verifyUrl={`${
        process.env.NODE_ENV! == "production"
          ? process.env.BASE_URL_DEV!
          : process.env.BASE_URL_PROD!
      }?q=${token}&callback=${callback}`}
      expiryMinutes={10}
    />
  );

  const { sendMail } = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_AUTH_USERNAME!,
      pass: process.env.EMAIL_AUTH_PASSWORD!,
    },
  });
  const mailOptions = {
    from: process.env.EMAIL_AUTH_USERNAME!,
    to: email,
    subject: `Verify your email.`,
    html,
  };
  await sendMail(mailOptions);
}
