import { google } from "googleapis";
import nodemailer from "nodemailer";

type Props = {
  toEmail: string;
  subject: string;
  html: string;
};

export const sendEmail = async ({ html, subject, toEmail }: Props) => {
  const oauth2Client = new google.auth.OAuth2({
    clientId: process.env.GOOGLE_CID,
    clientSecret: process.env.GOOGLE_CSE,
  });

  try {
    const token = await oauth2Client.getAccessToken();
    let transporter = nodemailer.createTransport({
      // @ts-ignore
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.GOOGLE_USER,
        clientId: process.env.GOOGLE_CID,
        clientSecret: process.env.GOOGLE_CSE,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
        accessToken: token.token,
      },
    });
    transporter.sendMail({
      to: toEmail,
      subject,
      html,
    });
    return "sent";
  } catch (err) {
    throw err;
  }
};
