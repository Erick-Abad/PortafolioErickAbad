require("dotenv").config();
const nodemailer = require("nodemailer");

// Configurar el manejador de la API para Vercel
module.exports = async (req, res) => {
  // Configuración de CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Manejo de preflight requests
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Método no permitido" });
  }

  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ success: false, message: "Todos los campos son obligatorios." });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"${name}" <${email}>`,
      to: process.env.EMAIL_TO,
      subject: `Nuevo mensaje: ${subject}`,
      text: `De: ${name}\nCorreo: ${email}\nMensaje:\n${message}`,
    });

    res.status(200).json({ success: true, message: "Correo enviado con éxito." });
  } catch (error) {
    console.error("Error al enviar correo:", error);
    res.status(500).json({ success: false, message: "Error al enviar el correo." });
  }
};
