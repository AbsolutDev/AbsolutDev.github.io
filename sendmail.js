require('dotenv').config();
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

function sendEmail(name, email, subject, message) {
  const msg = {
    to: 'absolutdev.io@gmail.com',
    from: 'absolutdev.io@gmail.com',
    subject: 'Message from Portfolio Website',
    text: `Message from ${name}, ${email}. Subject: ${subject}. Message: ${message}`,
    html: `Message from ${name}, ${email}.<br>Subject: ${subject}.<hr>Message: ${message}`
  }

  sgMail
  .send(msg)
  .then(() => {
    console.log('Email sent')
  })
  .catch((error) => {
    console.error(error)
  })
}
