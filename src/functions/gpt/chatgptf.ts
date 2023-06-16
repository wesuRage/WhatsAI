import { openai } from '../../core/openai';

export const ChatGPTf = async (prompt: string) => {

    const _prompt = prompt.replace('$gpt3', '');

    const request = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: _prompt,
        temperature: 0.2,
        max_tokens: 1024,
    });

    const response = request.data.choices[0].text.replace('\n', '');

    return response;
};