const { handleMessage } = require('../services/openAiService.js');  // Serviço que lida com o OpenAI
const { sendToWhatsApp } = require('../utils/sendWhatsapp.js');    // Função de envio para WhatsApp

// Função de controle do fluxo de mensagens
const userState = {};  // Estado do usuário

const whatsappHandler = async (req, res) => {
    const { Body, From } = req.body;
    const userMessage = Body.toLowerCase().trim();

    // Inicializa o estado do usuário, se necessário
    if (!userState[From]) {
        userState[From] = { step: 1 };
        return res.send('Olá! Qual é o seu nome?');
    }

    const state = userState[From];

    try {
        if (state.step === 1) {
            userState[From].name = userMessage;
            userState[From].step = 2;
            return res.send(`Olá, ${userMessage}! Quando você gostaria de agendar?`);
        } else if (state.step === 2) {
            // Validação simples de data (exemplo)
            const isValidDate = validateDate(userMessage); // Função de validação de data
            if (!isValidDate) {
                return res.send('Por favor, insira uma data válida.');
            }

            userState[From].date = userMessage;
            userState[From].step = 3;
            return res.send(`Você escolheu ${userMessage}. Está correto?`);
        } else if (state.step === 3) {
            if (userMessage.includes('sim')) {
                const aiResponse = await handleMessage(`Agendei para ${userState[From].name} no dia ${userState[From].date}`);
                sendToWhatsApp(From, aiResponse); // Envia resposta ao WhatsApp
                delete userState[From];  // Apaga o estado após o agendamento
                return res.send('Seu agendamento foi confirmado!');
            } else {
                userState[From].step = 2;
                return res.send('Por favor, digite novamente a data e horário que você gostaria de agendar.');
            }
        }
    } catch (error) {
        console.error('Erro ao processar a requisição:', error);
        return res.status(500).send('Erro interno');
    }
};

// Função simples para validar se a data está no formato correto (exemplo)
const validateDate = (dateString) => {
    const datePattern = /^\d{2}\/\d{2}\/\d{4}$/; // Exemplo de formato DD/MM/YYYY
    return datePattern.test(dateString);
};

module.exports = { whatsappHandler };
