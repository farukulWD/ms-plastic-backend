import nodemailer from "nodemailer";

export const sendEmail = async (to, html) => {
  const transporter = nodemailer.createTransport({
    // host: 'smtp.gmail.com.',
    // port: 587,
    service: "gmail",
    auth: {
      user: "farukgb1999@gmail.com",
      pass: "zqet jbyn nuxu cmoh",
    },
  });

  await transporter.sendMail({
    from: "farukgb1999@gmail.com",
    to,
    subject: "Reset your password within ten mins!",
    text: "",
    html,
  });
};
