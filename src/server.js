import express from 'express';
import nodemailer from 'nodemailer';
import { config } from 'dotenv';
import cors from 'cors';

config();

const app = express();

// Habilitar CORS para permitir chamadas de diferentes origens
const corsOptions = {
  origin: '*',  // Permite qualquer origem. Pode ser ajustado conforme necessidade
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
    const info = await transporter.sendMail({
      from: `Portfólio <${process.env.USER_MAIL}>`, // Remetente
      to: process.env.USER_MAIL, // Enviar para o e-mail configurado no .env
      cc: email, // Enviar também para o e-mail fornecido no corpo
      subject: `Olá, sou ${nome}`, // Assunto do e-mail
      text: `Mensagem de contato de ${nome}:\n\n${message}`, // Corpo simples de texto
    });

    console.log('E-mail enviado com sucesso:', info.response);
    return res.status(200).json({ status: 'E-mail enviado com sucesso!' });
  } catch (err) {
    console.error('Erro ao enviar o e-mail:', err);
    return res.status(500).json({ status: 'Houve um erro ao enviar o e-mail. Tente novamente.' });
  }
});

// Iniciar servidor localmente
app.listen(8080, () => {
  console.log('Servidor Express rodando na porta 8080');
});
