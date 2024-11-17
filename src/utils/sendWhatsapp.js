require('dotenv').config();
const axios = require('axios');
const jwt = require('jsonwebtoken');

const generateJWT = () => {
    const payload = {
        iss: process.env.ZENVIA_SIGNATURE, // Substitua com o identificador do emissor
        iat: Math.floor(Date.now() / 1000),
    };

    // Chave secreta ou privada (fornecida pela Zenvia ou configurada por você)
    const secretKey = process.env.ZENVIA_API_KEY //|| "sua-chave-secreta"; // Defina sua chave secreta

    // Gera o token JWT com o algoritmo de assinatura
    return jwt.sign(payload, secretKey, { algorithm: 'HS256' }); // Substitua 'HS256' por 'RS256', se necessário
};

const sendToWhatsApp = async (to, message) => {
    const zenviaApiUrl = 'https://api.zenvia.com/v2/chats';

    // Gera o token JWT
    const token = generateJWT();

    // Definindo os cabeçalhos com o token JWT gerado
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
    };

    console.log('Bearer token enviado:', headers.Authorization);
    console.log('ZENVIA_SIGNATURE:', process.env.ZENVIA_SIGNATURE);

    // Corpo da requisição com os dados da mensagem
    const body = {
        from: 'whatsapp:+5511995003578',  // Substitua com seu número de origem
        to: `whatsapp:+5511956553172`,  // O número de destino
        content: {
            type: 'text',
            text: message,  // A mensagem a ser enviada
        },
    };

    console.log('Request body:', JSON.stringify(body, null, 2)); // Logando o corpo da requisição

    try {
        // Enviando a requisição POST para a API da Zenvia
        const response = await axios.post(zenviaApiUrl, body, { headers });
        console.log('Mensagem enviada:', response.data);
    } catch (error) {
        console.error('Erro ao enviar mensagem para WhatsApp:', error.response ? error.response.data : error.message);
    }
};

module.exports = { sendToWhatsApp };
