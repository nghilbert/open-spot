import { User } from "@prisma/client";
import { prismaClient } from "../../prismaClient";
import { randomBytes } from "crypto";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const hostname = process.env.HOSTNAME || "http://localhost:3000";

export class EmailController {
  private prisma = prismaClient;
  private transporter;

  constructor() {
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
    const smtpPort = Number(process.env.SMTP_PORT) || 587;

    if (!smtpUser || !smtpPass) {
      throw new Error("Missing SMTP_USER or SMTP_PASS in environment");
    }

    this.transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });
  }

  private isEmail(address: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(address);
  }

  public async sendEmail(address: string, subject: string, content: string): Promise<boolean> {
    if (!this.isEmail(address)) return false;

    try {
      const info = await this.transporter.sendMail({
        from: `"OpenSpot" <${process.env.SMTP_USER}>`,
        to: address,
        subject,
        html: content,
      });

      console.log("Email sent:", info.messageId);
      return true;
    } catch (error) {
      console.error("Email send error:", error);
      return false;
    }
  }

  public async sendVerificationEmail(user: User): Promise<boolean> {
    const token = randomBytes(32).toString("hex");

    await this.prisma.verify.create({
      data: {
        token,
        userID: user.id,
      },
    });

    const content = `
      <p>Hello, please click this link to verify your email.</p><br>
      <a href="${hostname}/verify?token=${token}">Verify here</a>
    `;

    return await this.sendEmail(user.email, "Verify email", content);
  }

  public async finishVerification(token: string): Promise<boolean> {
    const verifyRow = await this.prisma.verify.findUnique({
      where: { token },
    });

    if (!verifyRow) return false;

    const isExpired = Date.now() - new Date(verifyRow.createdAt).getTime() > 1000 * 60 * 60 * 24;
    if (isExpired) {
      await this.prisma.verify.delete({ where: { token } });
      return false;
    }

    const userID = verifyRow.userID;
    await this.prisma.verify.delete({ where: { token } });

    const user = await this.prisma.user.findUnique({ where: { id: userID } });
    if (!user) return false;

    await this.prisma.user.update({
      data: { emailVerified: true, role: 'MEMBER' },
      where: { id: userID },
    });

    const content = `<p>Thank you for verifying your email.</p>`;
    await this.sendEmail(user.email, "Email verified", content);
    return true;
  }
}