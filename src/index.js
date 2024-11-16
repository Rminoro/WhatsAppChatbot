const express = require('express');
const dotenv = require('dotenv');
const { whatsappHandler } = require('./controllers/whatsappController');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Configura para aceitar JSON
app.use(express.json());

// Rota para o WhatsApp
app.post('/whatsapp', whatsappHandler);

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
