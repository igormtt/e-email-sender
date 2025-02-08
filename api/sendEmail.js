import express from 'express';
import nodemailer from 'nodemailer';
import { config } from 'dotenv';
import serverless from 'serverless-http';
import cors from 'cors';

config();

const app = express();

// Configuração do CORS para permitir chamadas do frontend
const corsOptions = {
  origin: '*',
};

app.use(cors(corsOptions));
app.use(express.json());

// Endpoint de teste
app.get('/', (req, res) => {
  res.send({ api: 'API - Node Mailer' });
});

// Função para enviar e-mail
app.post('/sendEmail', async (req, res) => {
  const { nome, email, message } = req.body;

  // Validações mínimas
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

  // Tentando enviar o e-mail
  try {
    // Usando um corpo simples de texto para minimizar o processamento
    const info = await transporter.sendMail({
      from: `Portfólio <${process.env.USER_MAIL}>`, // Remetente
      to: process.env.USER_MAIL, // Enviar para o e-mail configurado no .env
      cc: email, // Enviar também para o e-mail fornecido no corpo
      subject: `Olá, sou ${nome}`, // Assunto do e-mail
      text: `Mensagem de contato de ${nome}:\n\n${message}`, // Corpo simples de texto JESUSSSSS
    });

    console.log('E-mail enviado com sucesso:', info.response);
    return res.status(200).json({ status: 'E-mail enviado com sucesso!' });
  } catch (err) {
    console.error('Erro ao enviar o e-mail:', err);
    return res.status(500).json({ status: 'Houve um erro ao enviar o e-mail. Tente novamente.' });
  }
});

export default serverless(app);
