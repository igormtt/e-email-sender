import express from 'express';
import { config } from 'dotenv';
import { serverless } from 'serverless-http';

config(); 

const app = express();
app.use(express.json());


const PORT = process.env.PORT || 3000;


app.get('/', (req, res) => {
  res.send("Servidor Express está rodando na Vercel!");
});


app.post('/sendEmail', async (req, res) => {
  const { nome, email, message } = req.body;

  console.log('NOVA MENSAGEM')

  console.log(nome, " ",  email + " " , message)

  res.send({status: "Obrigado! Em breve entrarei em contato."})
});


if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
}

export default serverless(app);
