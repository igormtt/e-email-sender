import express from 'express';
import nodemailer from 'nodemailer';
import { config } from 'dotenv';
import serverless from 'serverless-http'; 
import cors from 'cors';  

config();

const app = express();

// Configuração do CORS
const corsOptions = {
  origin: '*',  
}; 

app.use(cors(corsOptions));
app.use(express.json()); 

// Teste de endpoint
app.get('/', (req, res) => {
  res.send({
    api: "API - Node Mailer"
  })
});

// Endpoint para enviar e-mail
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
      html: `...seu conteúdo HTML aqui...`, // conteúdo HTML do e-mail
    });

    return res.status(200).json({ status: 'E-mail enviado com sucesso!' });
  } catch (err) {
    console.error('Erro ao enviar o e-mail:', err);
    return res.status(500).json({ status: 'Houve um erro ao enviar o e-mail. Tente novamente.' });
  }
});

// Exporta a função serverless para Vercel
export default serverless(app);
