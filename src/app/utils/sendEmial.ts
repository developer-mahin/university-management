import nodemailer from 'nodemailer';
import config from '../config';

export const sendEmail = async (to: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: config.NODE_ENV === 'production',
    auth: {
      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
      user: 'mdmahin1310@gmail.com',
      pass: 'ebzr loqu rmlw avbc',
    },
  });

  await transporter.sendMail({
    from: 'mdmahin1310@gmail.com', // sender address
    to, // list of receivers
    subject: 'Reset your password within 10 minutes', // Subject line
    text: 'Reset your password', // plain text body
    html, // html body
  });
};
