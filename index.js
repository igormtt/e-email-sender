import nodemailer from 'nodemailer';
import { config } from 'dotenv';

config();

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ status: 'Método não permitido' });
  }

  const { nome, email, message } = req.body;

  if (!nome || !email || !message) {
    return res.status(400).json({ status: 'Por favor, preencha todos os campos.' });
  }

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.USER_MAIL,
      pass: process.env.PASS_MAIL,
    },
  });

  try {
    await transporter.sendMail({
      from: `Portfólio <${process.env.USER_MAIL}>`,
      to: email,
      subject: `Olá, sou ${nome}`,
      text: message,
    });

    return res.status(200).json({ status: 'E-mail enviado com sucesso!' });
  } catch (err) {
    console.error('Erro ao enviar o e-mail:', err);
    return res.status(500).json({ 
      status: 'Houve um erro ao enviar o e-mail. Tente novamente.',
      error: err.message 
    });
  }
}
