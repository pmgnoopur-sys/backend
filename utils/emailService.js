const nodemailer = require('nodemailer');
const path = require('path');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === 'true', // true for port 465, false for others
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const infoTransporter = nodemailer.createTransport({
  host: process.env.INFO_SMTP_HOST,
  port: Number(process.env.INFO_SMTP_PORT) || 587,
  secure: process.env.INFO_SMTP_SECURE === 'true', // true for port 465, false for others
  auth: {
    user: process.env.INFO_SMTP_USER,
    pass: process.env.INFO_SMTP_PASS,
  },
});

if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
  transporter.verify((error, success) => {
    if (error) {
      console.error('[SMTP] recruitment transporter verify failed:', error);
    } else {
      console.log('[SMTP] recruitment transporter ready:', success);
    }
  });
}

if (process.env.INFO_SMTP_HOST && process.env.INFO_SMTP_USER && process.env.INFO_SMTP_PASS) {
  infoTransporter.verify((error, success) => {
    if (error) {
      console.error('[SMTP] info transporter verify failed:', error);
    } else {
      console.log('[SMTP] info transporter ready:', success);
    }
  });
}

// Sends a career application's resume to the recruitment inbox.
async function sendResumeEmail(application) {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn('SMTP is not configured; skipping resume email.');
    return;
  }

  const {
    name,
    email,
    phone,
    position,
    yearsOfExperience,
    currentCompany,
    expectedSalary,
    noticePeriod,
    coverLetter,
    howDidYouHear,
    resumePath,
  } = application;

  const recipient = process.env.RECRUITMENT_EMAIL || 'recruitment@pmg-b2b.com';

  const html = `
    <h2>New Job Application${position ? `: ${position}` : ''}</h2>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Phone:</strong> ${phone || '-'}</p>
    <p><strong>Position:</strong> ${position || '-'}</p>
    <p><strong>Years of Experience:</strong> ${yearsOfExperience || '-'}</p>
    <p><strong>Current Company:</strong> ${currentCompany || '-'}</p>
    <p><strong>Expected Salary:</strong> ${expectedSalary || '-'}</p>
    <p><strong>Notice Period:</strong> ${noticePeriod || '-'}</p>
    <p><strong>How did you hear about us:</strong> ${howDidYouHear || '-'}</p>
    <p><strong>Cover Letter:</strong><br/>${coverLetter || '-'}</p>
  `;

  await transporter.sendMail({
    from: `"PMG Careers" <${process.env.SMTP_USER}>`,
    to: recipient,
    replyTo: email,
    subject: `New Job Application - ${name}${position ? ` (${position})` : ''}`,
    html,
    attachments: resumePath
      ? [{ filename: path.basename(resumePath), path: resumePath }]
      : [],
  });
}

// Sends a "Contact Us" form submission to the info inbox.
async function sendContactEmail(contact) {
  if (!process.env.INFO_SMTP_HOST || !process.env.INFO_SMTP_USER || !process.env.INFO_SMTP_PASS) {
    console.warn('INFO SMTP is not configured; skipping contact email.');
    return;
  }

  const { name, email, phone, company, message } = contact;

  const recipient = process.env.INFO_EMAIL || 'info@pmg-b2b.com';

  const html = `
    <h2>New Contact Us Submission</h2>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Phone:</strong> ${phone || '-'}</p>
    <p><strong>Company:</strong> ${company || '-'}</p>
    <p><strong>Message:</strong><br/>${message || '-'}</p>
  `;

  const info = await infoTransporter.sendMail({
    from: `"PMG B2B Website" <${process.env.INFO_SMTP_USER}>`,
    to: recipient,
    replyTo: email,
    subject: `New Contact Us Submission - ${name}`,
    html,
  });
  console.log('Contact email sent:', info.messageId, info.response);
}

module.exports = { sendResumeEmail, sendContactEmail };
