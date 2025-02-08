// api/server.js

import express from 'express';
import nodemailer from 'nodemailer';
import { config } from 'dotenv';

config(); // Carrega as variáveis de ambiente

const app = express();
app.use(express.json());

// Defina a porta de conexão
const PORT = process.env.PORT || 3000;

// Rota para teste
app.get('/', (req, res) => {
  res.send("Servidor Express está rodando na Vercel!");
});

// Rota para envio de e-mail
app.post('/sendEmail', async (req, res) => {
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
      to: process.env.USER_MAIL,
      cc: email,
      subject: `Olá, sou ${nome}`,
      html: `<h1>Mensagem de Contato</h1><p><strong>Nome:</strong> ${nome}</p><p><strong>E-mail:</strong> ${email}</p><p><strong>Mensagem:</strong> ${message}</p>`
    });

    return res.status(200).json({ status: 'E-mail enviado com sucesso!' });
  } catch (err) {
    console.error('Erro ao enviar o e-mail:', err);
    return res.status(500).json({ status: 'Houve um erro ao enviar o e-mail. Tente novamente.' });
  }
});

// Iniciar servidor (necessário para Vercel)
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
}

export default app;
