const nodemailer = require('nodemailer')

module.exports = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "4806d3d362da0e",
      pass: "e0b3da0c550d73"
    }
  });

  