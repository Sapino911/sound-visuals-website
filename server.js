const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
require('dotenv').config();

const nodemailer = require('nodemailer');

const PORT = Number(process.env.PORT || 3000);
const CONTACT_EMAIL = process.env.CONTACT_EMAIL || 'soundvisuals@otcmvs.co.za';
const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = Number(process.env.SMTP_PORT || 587);
const SMTP_SECURE = process.env.SMTP_SECURE === 'true';
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const SMTP_FROM = process.env.SMTP_FROM || CONTACT_EMAIL;
const DATA_DIR = path.join(__dirname, 'data');
const SUBMISSIONS_FILE = path.join(DATA_DIR, 'contact-submissions.jsonl');

const allowedOrigins = new Set([
  'http://localhost:4200',
  'http://127.0.0.1:4200'
]);

function setCorsHeaders(req, res) {
  const origin = req.headers.origin;

  if (allowedOrigins.has(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(payload));
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';

    req.on('data', (chunk) => {
      body += chunk;

      if (body.length > 16_384) {
        reject(new Error('Request body is too large.'));
        req.destroy();
      }
    });

    req.on('end', () => {
      try {
        resolve(JSON.parse(body || '{}'));
      } catch {
        reject(new Error('Invalid JSON request body.'));
      }
    });

    req.on('error', reject);
  });
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function validateContactSubmission(payload) {
  const errors = {};

  if (!payload.name || payload.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters.';
  }

  if (!payload.email || !isValidEmail(payload.email)) {
    errors.email = 'A valid email address is required.';
  }

  if (!payload.eventType) {
    errors.eventType = 'Event type is required.';
  }

  if (!payload.eventDate) {
    errors.eventDate = 'Event date is required.';
  }

  if (!payload.details || payload.details.trim().length < 20) {
    errors.details = 'Project details must be at least 20 characters.';
  }

  return errors;
}

function normalizeContactSubmission(payload) {
  return {
    id: crypto.randomUUID(),
    receivedAt: new Date().toISOString(),
    name: payload.name.trim(),
    email: payload.email.trim(),
    eventType: payload.eventType,
    eventDate: payload.eventDate,
    details: payload.details.trim()
  };
}

async function saveContactSubmission(submission) {
  await fs.promises.mkdir(DATA_DIR, { recursive: true });
  await fs.promises.appendFile(SUBMISSIONS_FILE, `${JSON.stringify(submission)}\n`, 'utf8');
}

function isSmtpConfigured() {
  return Boolean(SMTP_HOST && SMTP_USER && SMTP_PASS && CONTACT_EMAIL);
}

function createMailTransport() {
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_SECURE,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS
    }
  });
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function getEventTypeLabel(value) {
  const labels = {
    corporate: 'Corporate event',
    launch: 'Product launch',
    live: 'Live production',
    private: 'Private function'
  };

  return labels[value] || 'Event enquiry';
}

function createContactEmail(submission) {
  const eventType = getEventTypeLabel(submission.eventType);
  const subject = `New AV enquiry: ${eventType} on ${submission.eventDate}`;
  const text = [
    `New Sound & Visuals enquiry`,
    '',
    `Reference: ${submission.id}`,
    `Received: ${submission.receivedAt}`,
    `Name: ${submission.name}`,
    `Email: ${submission.email}`,
    `Event type: ${eventType}`,
    `Event date: ${submission.eventDate}`,
    '',
    'Project details:',
    submission.details
  ].join('\n');

  const html = `
    <h2>New Sound &amp; Visuals enquiry</h2>
    <p><strong>Reference:</strong> ${escapeHtml(submission.id)}</p>
    <p><strong>Received:</strong> ${escapeHtml(submission.receivedAt)}</p>
    <p><strong>Name:</strong> ${escapeHtml(submission.name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(submission.email)}</p>
    <p><strong>Event type:</strong> ${escapeHtml(eventType)}</p>
    <p><strong>Event date:</strong> ${escapeHtml(submission.eventDate)}</p>
    <h3>Project details</h3>
    <p>${escapeHtml(submission.details).replaceAll('\n', '<br>')}</p>
  `;

  return { subject, text, html };
}

async function sendContactEmail(submission) {
  if (!isSmtpConfigured()) {
    const error = new Error('SMTP is not configured. Add SMTP_HOST, SMTP_USER, and SMTP_PASS to your .env file.');
    error.code = 'SMTP_NOT_CONFIGURED';
    throw error;
  }

  const transporter = createMailTransport();
  const email = createContactEmail(submission);

  await transporter.sendMail({
    from: SMTP_FROM,
    to: CONTACT_EMAIL,
    replyTo: submission.email,
    subject: email.subject,
    text: email.text,
    html: email.html
  });
}

async function handleContact(req, res) {
  try {
    const payload = await readJsonBody(req);
    const errors = validateContactSubmission(payload);

    if (Object.keys(errors).length > 0) {
      sendJson(res, 400, { message: 'Please fix the highlighted fields.', errors });
      return;
    }

    const submission = normalizeContactSubmission(payload);
    await saveContactSubmission(submission);
    await sendContactEmail(submission);

    console.log(`New contact enquiry ${submission.id} emailed to ${CONTACT_EMAIL}`);
    sendJson(res, 201, {
      message: 'Thanks. Your enquiry has been sent.',
      id: submission.id
    });
  } catch (error) {
    console.error(error);
    const isMissingSmtp = error.code === 'SMTP_NOT_CONFIGURED';

    sendJson(res, isMissingSmtp ? 503 : 502, {
      message: isMissingSmtp
        ? 'Email service is not configured yet. Please add SMTP settings on the server.'
        : 'Your enquiry was saved, but email delivery failed. Please contact us directly or try again shortly.'
    });
  }
}

const server = http.createServer(async (req, res) => {
  setCorsHeaders(req, res);

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method === 'GET' && req.url === '/api/health') {
    sendJson(res, 200, {
      status: 'ok',
      smtpConfigured: isSmtpConfigured()
    });
    return;
  }

  if (req.method === 'POST' && req.url === '/api/contact') {
    await handleContact(req, res);
    return;
  }

  sendJson(res, 404, { message: 'Route not found.' });
});

server.listen(PORT, () => {
  console.log(`Sound & Visuals API listening on http://localhost:${PORT}`);
});
