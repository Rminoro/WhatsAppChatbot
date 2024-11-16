

const { OpenAI } = require('openai');
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const handleMessage = async (message) => {
    try {
        const aiResponse = await openai.chat.completions.create({
            model: 'gpt-4',
            messages: [{ role: 'user', content: message }],
        });
        return aiResponse.choices[0].message.content;
    } catch (error) {
        console.error('Erro ao gerar resposta do OpenAI:', error);
        return 'Desculpe, houve um erro ao processar sua solicitação.';
    }
};

module.exports = { handleMessage };
