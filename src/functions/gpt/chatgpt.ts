import { openai } from '../../core/openai';

export const ChatGPT = async (content: string) => {

    const _content = content.replace('$gpt', '').replace('$gpt-tts', '');

    const request = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{role: "user", content: _content}],
        temperature: 0.2,
        max_tokens: 1024,
    })

    const response = request.data.choices[0].message.content.replace('\n', '').replace('\n', '');

    return response;
};