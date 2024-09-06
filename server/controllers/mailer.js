import nodemailer from "nodemailer";
import Mailgen from "mailgen";
import ENV from "../config.js";

// Create a nodemailer transporter for Gmail
const transporter = nodemailer.createTransport({
  host: ENV.SMTP_HOST, // Gmail's SMTP host
  port: ENV.SMTP_PORT, // Gmail's SMTP port
  secure: true, // Use SSL for Gmail
  auth: {
    user: ENV.SMTP_MAIL, // Your Gmail email
    pass: ENV.SMTP_PASSWORD, // Your Gmail app password
  },
});

let MailGenerator = new Mailgen({
  theme: "default",
  product: {
    name: "Your Service", // Personal service name or app name
    link: "https://yourservice.com/", // Personal website or app link
  },
});

/** POST: http://localhost:8080/api/registerMail 
 * @param: {
  "username": "example123",
  "userEmail": "admin123@gmail.com",
  "text": "",
  "subject": "",
}
*/
export const registerMail = async (req, res) => {
  const { username, userEmail, text, subject } = req.body;

  // Email content
  var email = {
    body: {
      name: username,
      intro:
        text ||
        `Hi ${username}, welcome! We're thrilled to have you with us. You’re now part of a special community, and we hope you have a great experience.`,
      outro:
        "If you have any questions, just reply to this email. We’re here to help.",
    },
  };

  var emailBody = MailGenerator.generate(email);

  let message = {
    from: ENV.SMTP_MAIL, // Gmail address
    to: userEmail, // Recipient's email
    subject: subject || "Welcome aboard!",
    html: emailBody,
  };

  // Send the email
  transporter
    .sendMail(message)
    .then(() => {
      return res.status(200).send({ msg: "Email sent successfully!" });
    })
    .catch((error) => res.status(500).send({ error: "Error sending email" }));
};
