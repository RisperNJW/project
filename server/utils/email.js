import nodemailer from 'nodemailer';

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

// Email templates
const emailTemplates = {
  verification: (data) => ({
    subject: 'Verify Your Email - Go2Bookings',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #059669;">Welcome to Go2Bookings!</h2>
        <p>Hi ${data.name},</p>
        <p>Thank you for joining our platform. Please verify your email address by clicking the button below:</p>
        <a href="${data.verificationUrl}" style="background-color: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0;">
          Verify Email
        </a>
        <p>If you didn't create an account, please ignore this email.</p>
        <p>Best regards,<br>Go2Bookings Team</p>
      </div>
    `
  }),
  
  'password-reset': (data) => ({
    subject: 'Password Reset - Go2Bookings Platform',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #059669;">Password Reset Request</h2>
        <p>Hi ${data.name},</p>
        <p>You requested to reset your password. Click the button below to create a new password:</p>
        <a href="${data.resetUrl}" style="background-color: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0;">
          Reset Password
        </a>
        <p>This link will expire in 10 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
        <p>Best regards,<br>Go2Bookings Team</p>
      </div>
    `
  }),
  
  'booking-confirmation': (data) => ({
    subject: 'Booking Confirmation - Go2Bookings Platform',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #059669;">Booking Confirmed!</h2>
        <p>Hi ${data.customerName},</p>
        <p>Your booking has been confirmed. Here are the details:</p>
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>${data.serviceName}</h3>
          <p><strong>Booking ID:</strong> ${data.bookingId}</p>
          <p><strong>Date:</strong> ${data.date}</p>
          <p><strong>Guests:</strong> ${data.guests}</p>
          <p><strong>Total Amount:</strong> $${data.amount}</p>
        </div>
        <p>We're excited to have you experience the beauty of Kenya!</p>
        <p>Best regards,<br>Go2Bookings Team</p>
      </div>
    `
  })
};

export const sendEmail = async ({ to, template, data }) => {
  try {
    const transporter = createTransporter();
    const emailTemplate = emailTemplates[template](data);
    
    const mailOptions = {
      from: `"Go2Bookings Platform" <${process.env.SMTP_USER}>`,
      to,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result.messageId);
    return result;
  } catch (error) {
    console.error('Email sending failed:', error);
    throw error;
  }
};