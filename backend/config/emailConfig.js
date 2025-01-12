import nodemailer from 'nodemailer';

let testAccount = null;
let transporter = null;

async function emailTransport() {
  if (!testAccount) {
    testAccount = await nodemailer.createTestAccount();
  }
  
  transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  return transporter;
}

export { emailTransport };