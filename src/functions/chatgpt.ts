import { Configuration, OpenAIApi} from 'openai';
require('dotenv').config();

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(configuration);

export const ChatGPT = async (prompt: string) => {

    const _prompt = prompt.replace('$gpt', '').replace('$gpt-tts', '');
    console.log(_prompt)

    const request = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: _prompt,
        temperature: 0.2,
        max_tokens: 1024,
    });

    const response = request.data.choices[0].text.replace('\n', '').replace('\n', '');

    return response
};