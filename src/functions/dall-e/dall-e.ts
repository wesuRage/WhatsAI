import { Configuration, OpenAIApi} from 'openai';
require('dotenv').config();

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(configuration);

export const Dall_E = async (prompt: string) => {

    const _prompt = prompt.replace('$dall-e', '');

    const request = await openai.createImage({
        prompt: _prompt,
        n: 1,
    });

    const response = request.data.data[0].url;
    
    console.log(response)

    return response;
};
