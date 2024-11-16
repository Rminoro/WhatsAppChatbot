const axios = require('axios');

const sendToWhatsApp = async (to, message) => {
    const zenviaApiUrl = 'https://api.zenvia.com/v2/chats';  // Endpoint para v2
    const headers = {
        'Authorization': `Bearer ${process.env.ZENVIA_API_KEY}`,  // Certifique-se de que a chave da API está correta
        'Content-Type': 'application/json',
    };

    const body = {
        from: 'whatsapp:+5511995003578',  // Número de WhatsApp associado à sua conta Zenvia
        to: to,                           // Número de destino
        content: {
            type: 'text',
            text: message,               // Texto da mensagem
        },
    };

    try {
        const response = await axios.post(zenviaApiUrl, body, { headers });
        console.log('Mensagem enviada:', response.data);
    } catch (error) {
        console.error('Erro ao enviar mensagem para WhatsApp:', error);
    }
};

module.exports = { sendToWhatsApp };
