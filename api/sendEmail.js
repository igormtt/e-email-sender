import express from 'express';
import nodemailer from 'nodemailer';
import { config } from 'dotenv';
import serverless from 'serverless-http'; 
import cors from 'cors';  

config();

const app = express();


const corsOptions = {
  origin: '*',  
  methods: ['GET', 'POST'], 
  allowedHeaders: ['Content-Type', 'Authorization'],  
  preflightContinue: false,
  optionsSuccessStatus: 200,  
}; // Atualizando as propriedades de CORS

app.use(cors(corsOptions));

app.use(express.json()); 

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
      to: email,
      subject: `Olá, sou ${nome}`,
      text: message,
    });

    return res.status(200).json({ status: 'E-mail enviado com sucesso!' });
  } catch (err) {
    console.error('Erro ao enviar o e-mail:', err);
    return res.status(500).json({ status: 'Houve um erro ao enviar o e-mail. Tente novamente.' });
  }
});

export default serverless(app);
