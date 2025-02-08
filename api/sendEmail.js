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
      to: process.env.USER_MAIL,
      cc: email,
      subject: `Olá, sou ${nome}`,
      html: `
      <!DOCTYPE html>
      <html lang="pt-br">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Mensagem de Contato</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            color: #333;
            line-height: 1.6;
          }
          .header {
            font-size: 24px;
            color: #4CAF50;
            font-weight: bold;
          }
          .message-content {
            margin-top: 20px;
          }
          .message-content p {
            font-size: 16px;
            margin-bottom: 10px;
          }
          .message-content ul {
            margin: 10px 0;
          }
          .message-content li {
            margin-bottom: 8px;
          }
          .footer {
            margin-top: 40px;
            font-size: 14px;
            color: #555;
          }
          .footer a {
            color: #4CAF50;
            text-decoration: none;
          }
        </style>
      </head>
      <body>
        <div class="message-content">
          <p class="header">Olá, sou o Igor!</p>
      
          <p>Esta é uma cópia para você!. Informações solicitadas:</p>
      
          <ul>
            <li><strong>Nome:</strong> ${nome}</li>
            <li><strong>E-mail:</strong> ${email}</li>
            <li><strong>Mensagem:</strong></li>
            <li><blockquote>${message}</blockquote></li>
          </ul>
      
          <div class="footer">
            <p>Caso queira discutir mais detalhes, entre em contato comigo através do meu e-mail: <a href="mailto:${email}">${email}</a>.</p>
            <p>Atenciosamente,<br><strong>${nome}</strong></p>
          </div>
        </div>
      </body>
      </html>
      `,
    });
  
    return res.status(200).json({ status: 'E-mail enviado com sucesso!' });
  } catch (err) {
    console.error('Erro ao enviar o e-mail:', err);
    return res.status(500).json({ status: 'Houve um erro ao enviar o e-mail. Tente novamente.' });
  }
});

app.listen(8080, () => {
  console.log('Rodando')
})

export default serverless(app);
