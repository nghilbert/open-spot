import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

export async function sendVerificationEmail(user: { email: string; name: string }, link: string): Promise<boolean> {
  const html = `
    <h2>Hello ${user.name},</h2>
    <p>Please verify your email by clicking <a href="${link}">this link</a>.</p>
  `;

  try {
    const response = await transporter.sendMail({
      from: '"OpenSpot" <noreply@openspot.dev>',
      to: user.email,
      subject: 'Verify your email',
      html
    });

    console.log('Email sent:', response.messageId);
    return true;
  } catch (error) {
    console.error('Email error:', error);
    return false;
  }
}