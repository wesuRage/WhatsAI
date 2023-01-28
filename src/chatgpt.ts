import { Configuration, OpenAIApi} from 'openai';
require('dotenv').config();

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(configuration);

export async function ChatGPT(params: any){

    const _prompt: string = String(params.prompt).replace('$gpt', '')

    const request = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: _prompt,
        temperature: 0.2,
        max_tokens: 1024,
    });

    const response = request.data.choices[0].text;

    return response
};
