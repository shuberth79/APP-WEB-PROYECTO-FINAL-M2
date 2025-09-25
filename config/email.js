const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail", // o el servicio que uses (Outlook, SMTP propio, etc.)
    auth: {
        user: process.env.EMAIL_USER, // tu correo
        pass: process.env.EMAIL_PASS, // contraseña o App Password
    },
});

module.exports = transporter;
