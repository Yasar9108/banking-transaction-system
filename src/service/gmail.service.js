const nodeMailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

// simple methode using gmail service and email and password for authentication
// console.log(" Email User : " + process.env.EMAIL_USER);
// console.log(" Email Pass : " + process.env.EMAIL_PASS);
const transporter = nodeMailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// methode using OAuth2 for authentication
// const transporter = nodeMailer.createTransport({
//   service: 'gmail',
//   auth: {
//     type: 'OAuth2',
//     user: process.env.EMAIL_USER,
//     clientId: process.env.CLIENT_ID,
//     clientSecret: process.env.CLIENT_SECRET,
//     refreshToken: process.env.REFRESH_TOKEN,
//   },
// });

// Verify the connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error("Error connecting to email server:", error);
  } else {
    console.log("Email server is ready to send messages");
  }
});

// Function to send email
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Backend Ledger" <${process.env.EMAIL_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodeMailer.getTestMessageUrl(info));
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

async function sendRegistrationEmail(userEmail, userName) {
  const subject = " Welcome to Backend Ledger!";
  const text = ` Hi ${userName}, \n\t\t Thank you for registering with Backend Ledger, We are Excited to have you on board! `;
  const html = `<p>Hi ${userName},</p><p>Thank you for registering with Backend Ledger, We are Excited to have you on board!</p>`;
  await sendEmail(userEmail, subject, text, html);
}

async function sendTransactionEmail(
  userEmail,
  userName,
  amount,
  receiverAccountId,
) {
  const subject = " Transaction Alert from Backend Ledger!";
  const text = ` Hi ${userName}, \n\t\t A transaction of amount ${amount} has been made to account ${receiverAccountId}. Please check your account for more details.`;
  const html = `<p>Hi ${userName},</p><p>A transaction of amount ${amount} has been made to account ${receiverAccountId}. Please check your account for more details.</p>`;
  await sendEmail(userEmail, subject, text, html);
}

async function sendAccountFrozenMail(userEmail, userName) {
  const subject = "Account Freeze Notification - Backend Ledger";

  const text = `Hi ${userName}, Your account has been frozen by the administrator.
          If you believe this was done in error or need more information, please contact Backend Ledger support.
          Regards,
          Backend Ledger Team`;

  const html = `
    <p>Hi ${userName},</p>

    <p>Your account has been <strong>frozen</strong> by the administrator.</p>

    <p>If you believe this was done in error or need more information, please contact Backend Ledger support.</p>

    <p>Regards,<br/>Backend Ledger Team</p>
  `;

  await sendEmail(userEmail, subject, text, html);
}

async function sendUnfrozenMail(userEmail, userName) {
  const subject = "Account Reactivation Notification - Backend Ledger";

  const text = `Hi ${userName},

Your account has been successfully reactivated by the administrator.

You can now access your account and perform transactions normally.

If you have any questions, please contact Backend Ledger support.

Regards,
Backend Ledger Team`;

  const html = `
    <p>Hi ${userName},</p>

    <p>Your account has been <strong>reactivated</strong> by the administrator.</p>

    <p>You can now access your account and perform transactions normally.</p>

    <p>If you have any questions, please contact Backend Ledger support.</p>

    <p>Regards,<br/>Backend Ledger Team</p>
  `;

  await sendEmail(userEmail, subject, text, html);
}

module.exports = {
  sendRegistrationEmail,
  sendTransactionEmail,
  sendAccountFrozenMail,
  sendUnfrozenMail
};
