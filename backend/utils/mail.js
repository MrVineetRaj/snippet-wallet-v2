import Mailgen from "mailgen";
import nodemailer from "nodemailer";
import { ApiError } from "./api.error.js";

const sendMail = async (options) => {
  const mailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "Snippet Wallet",
      link: "https://snippetwallet.unknownbug.tech/",
    },
  });
  //info : Generate an HTML email with the provided contents
  const emailHTML = mailGenerator.generate(options.mailGenContent);

  //info : Generate the plaintext version of the e-mail (for clients that do not support HTML)
  const emailText = mailGenerator.generatePlaintext(options.mailGenContent);

  const transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_HOST,
    port: process.env.MAILTRAP_PORT,
    secure: false, // true for port 465, false for other ports
    auth: {
      user: process.env.MAILTRAP_USER,
      pass: process.env.MAILTRAP_PASS,
    },
  });

  const mailOptions = {
    from: `"snippetwallet" <${process.env.MAILTRAP_EMAIL}>`, // sender address
    to: options.email, // list of receivers
    subject: options.subject, // Subject line
    text: emailText, // plain text body
    html: emailHTML, // html body
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    // console.log(info);
    return info;
  } catch (err) {
    throw new ApiError(500, "Error Sending the mail", err);
  }
};

const emailVerificationMailContent = (username, verificationUrl) => {
  return {
    body: {
      name: username,
      intro: "Welcome to Collabrix! We're very excited to have you on board.",
      action: {
        instructions: "To get started with Collabrix, please click here:",
        button: {
          color: "#22BC66", // info :Optional action button color
          text: "Verify your email",
          link: verificationUrl,
        },
      },
      outro: "If not by you then we are sorry !\n ignore this message.",
    },
  };
};

const forgotPasswordMailContent = (fullname, passwordResetURL) => {
  return {
    body: {
      name: fullname,
      intro: "Forgot your password? No worries we are here for you.",
      action: {
        instructions:
          "To reset your password for Collabrix, please click here:",
        button: {
          color: "#22BC66", // info :Optional action button color
          text: "ResetPassword",
          link: passwordResetURL,
        },
      },
      outro: "If not by you then we are sorry !\n ignore this message.",
    },
  };
};

export { sendMail, emailVerificationMailContent, forgotPasswordMailContent };
