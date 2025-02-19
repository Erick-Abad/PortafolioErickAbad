require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3001;

// Configurar CORS para permitir solicitudes desde tu frontend
const corsOptions = {
  origin: ["https://portafolio-erick-abad.vercel.app"], // Agrega aquí tu dominio en Vercel
  methods: "POST",
  allowedHeaders: ["Content-Type"]
};

app.use(cors(corsOptions));
app.use(express.json());

// Configurar el transportador de Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS,
  },
});

// Ruta para manejar el envío del formulario
app.post("/api/send-email", async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ success: false, message: "Todos los campos son obligatorios." });
  }

  const mailOptions = {
    from: `"${name}" <${email}>`,
    to: process.env.EMAIL_TO,
    subject: `Nuevo mensaje: ${subject}`,
    text: `De: ${name} \nCorreo: ${email} \nMensaje: ${message}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: "Correo enviado con éxito." });
  } catch (error) {
    console.error("Error al enviar el correo:", error);
    res.status(500).json({ success: false, message: "Error al enviar el correo." });
  }
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
