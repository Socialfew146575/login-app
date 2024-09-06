import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const config = {
  JWT_SECRET: process.env.JWT_SECRET,
  SMTP_SERVICE: process.env.SMTP_SERVICE,
  SMTP_MAIL: process.env.SMTP_MAIL,
  SMTP_PASSWORD: process.env.SMTP_PASSWORD,
  SMTP_PORT: process.env.SMTP_PORT,
  SMTP_HOST: process.env.SMTP_HOST,
  MONGO_URI: process.env.MONGO_URI,
};

export default config;
