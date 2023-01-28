import { Configuration, OpenAIApi } from "openai";
import { Bot } from "../interfaces/Bot";
import "dotenv/config";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function ChatGPT(params: any) {
  const _prompt: string = String(params.prompt);
  const request = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: _prompt,
    temperature: 0.2,
    max_tokens: 1024,
  });

  const response = request.data.choices[0].text;
  return { response };
}

export async function gpt(bot: Bot) {
  const { reply, webMessage } = bot;
  const msg = webMessage.message.extendedTextMessage.text;
  const question = msg.replace("$gpt", "");
  const { response } = await ChatGPT({ prompt: question });
  return reply(response);
}
