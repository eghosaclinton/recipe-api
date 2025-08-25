//@ts-nocheck
import nodemailer from "nodemailer";
import * as dotenv from "dotenv";
import { readFile } from "fs/promises";

dotenv.config();

interface VerificationOptions {
  //   token: string;
  email: string;
  //   callback: string;
}

export async function sendVerificationEmail(options: VerificationOptions) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_AUTH_USERNAME!,
      pass: process.env.EMAIL_AUTH_PASSWORD!,
    },
  });
  const emailTemplate = await readFile("./templates/verification.html", "utf-8")
  const mailOptions = {
    from: process.env.EMAIL_AUTH_USERNAME!,
    to: options.email,
    subject: `Testing`,
    html: `
        <h1>Testing 2</h1>
    `,
  };

  await transporter.sendMail(mailOptions);
}
