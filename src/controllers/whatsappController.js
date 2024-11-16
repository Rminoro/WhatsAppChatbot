const { handleMessage } = require('../services/openAiService.js');  // Serviço que lida com o OpenAI
const { sendToWhatsApp } = require('../utils/sendWhatsapp.js');    // Função de envio para WhatsApp
const { authorize, createGoogleCalendarEvent } = require('../services/googleCalendarService.js'); // Serviços do Google Calendar

// Estado do usuário
const userState = {};  

// Função de controle do fluxo de mensagens
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
            // Validação simples de data e hora (exemplo: DD/MM/YYYY HH:mm)
            const isValidDateTime = validateDateTime(userMessage);
            if (!isValidDateTime) {
                return res.send('Por favor, insira uma data e horário válidos no formato DD/MM/YYYY HH:mm.');
            }

            userState[From].date = userMessage;
            userState[From].step = 3;
            return res.send(`Você escolheu ${userMessage}. Está correto?`);
        } else if (state.step === 3) {
            if (userMessage.includes('sim')) {
                try {
                    // Autenticação com o Google
                    const auth = await authorize();

                    // Processa a data e horário para criar o evento
                    const [date, time] = userState[From].date.split(' '); // Exemplo: "12/12/2024 10:00"
                    const [day, month, year] = date.split('/');
                    const [hour, minute] = time.split(':');

                    const startDateTime = new Date(year, month - 1, day, hour, minute).toISOString();
                    const endDateTime = new Date(year, month - 1, day, hour, parseInt(minute) + 30).toISOString();

                    // Dados do evento
                    const eventData = {
                        summary: `Agendamento de ${userState[From].name}`,
                        description: `Agendamento feito pelo WhatsApp.`,
                        startDateTime,
                        endDateTime,
                    };

                    // Cria o evento no Google Calendar
                    const event = await createGoogleCalendarEvent(auth, eventData);

                    // Confirmação para o usuário
                    sendToWhatsApp(From, `Seu agendamento foi confirmado! Veja os detalhes no Google Calendar: ${event.htmlLink}`);
                    delete userState[From]; // Limpa o estado
                    return res.send('Seu agendamento foi confirmado!');
                } catch (error) {
                    console.error('Erro ao criar evento no Google Calendar:', error);
                    return res.send('Ocorreu um erro ao tentar confirmar o agendamento. Tente novamente mais tarde.');
                }
            } else {
                userState[From].step = 2; // Retorna para a etapa anterior
                return res.send('Por favor, digite novamente a data e horário que você gostaria de agendar.');
            }
        }
    } catch (error) {
        console.error('Erro ao processar a requisição:', error);
        return res.status(500).send('Erro interno');
    }
};

// Função para validar data e horário (formato DD/MM/YYYY HH:mm)
const validateDateTime = (dateTimeString) => {
    const dateTimePattern = /^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}$/; // Exemplo de formato DD/MM/YYYY HH:mm
    return dateTimePattern.test(dateTimeString);
};

module.exports = { whatsappHandler };
