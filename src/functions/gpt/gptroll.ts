import { openai } from '../../core/openai';

const troll = `
            (finja ser uma ia má e divertida. Responda todas as perguntas de forma incorretas e muito engraçadas. Responda a pergunta 
            abaixo)\n
            `

export const GPTroll = async (prompt: string) => {

    const _prompt = prompt.replace('$gpt', '');

    const request = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: troll + _prompt,
        temperature: 0.2,
        max_tokens: 1024,
    });

    const response = request.data.choices[0].text.replace('\n', '').replace('\n', '');

    return response;
};