// const axios = require('axios');


// require('dotenv').config();  // Certifique-se de carregar o dotenv no início do arquivo

// const sendToWhatsApp = async (to, message) => {
//     console.log('ZENVIA_API_KEY:', process.env.ZENVIA_API_KEY);
//     const zenviaApiUrl = 'https://api.zenvia.com/v2/chats';  // Endpoint para v2
//     const headers = {
//         'Authorization': `Bearer ${process.env.ZENVIA_API_KEY.trim()}`,  // Garantir que o valor da chave esteja correto
//         'Content-Type': 'application/json',
//     };
    
    

// //     const body = {
// //         from: 'whatsapp:+5511995003578',  // Número de WhatsApp
// //         to: 'whatsapp:+5511995000000',   // Número de destino
// //         content: {
// //             type: 'text',
// //             text: message,               // Texto da mensagem
// //         },
// //     };

// //     try {
// //         const response = await axios.post(zenviaApiUrl, body, { headers });
// //         console.log('Mensagem enviada:', response.data);
// //     } catch (error) {
// //         console.error('Erro ao enviar mensagem para WhatsApp:', error);
// //     }
// // };
// const body = {
//     from: 'whatsapp:+5511995003578',
//     to: 'whatsapp:+5511995000000',
//     content: {
//         type: 'text',
//         text: 'Olá, essa é uma mensagem de teste!',
//     },
// };

// try {
//     const response = await axios.post(zenviaApiUrl, body, { headers });
//     console.log('Mensagem enviada:', response.data);
// } catch (error) {
//     console.error('Erro ao enviar mensagem:', error.response ? error.response.data : error.message);
// }

// }
// module.exports = { sendToWhatsApp };
// Certifique-se de que o axios está sendo importado corretamente

require('dotenv').config();  // Carrega as variáveis de ambiente do arquivo .env
const axios = require('axios');  

const sendToWhatsApp = async (to, message) => {
    const zenviaApiUrl = 'https://api.zenvia.com/v2/chats';  // Endpoint da Zenvia
    const headers = {
        'Authorization': `Bearer ${process.env.ZENVIA_API_KEY}`,  // Com o token carregado corretamente
        'Content-Type': 'application/json',
    };
    
    console.log('Bearer token enviado:', `Bearer ${process.env.ZENVIA_API_KEY}`);
    console.log('ZENVIA_API_KEY:', process.env.ZENVIA_API_KEY);



    const body = {
        from: 'whatsapp:+5511995003578',  // Seu número de WhatsApp
        to: 'whatsapp:+5511995000000',    // Número de destino
        content: {
            type: 'text',
            text: message,                // Texto da mensagem
        },
    };

    try {
        const response = await axios.post(zenviaApiUrl, body, { headers });
        console.log('Mensagem enviada:', response.data);
    } catch (error) {
        console.error('Erro ao enviar mensagem para WhatsApp:', error.response ? error.response.data : error.message);
    }
};

module.exports = { sendToWhatsApp };
