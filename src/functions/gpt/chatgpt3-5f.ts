import { openai } from "../../core/openai";

export const ChatGPT3_5f = async (prompt: string, user: string) => {
  const _prompt = prompt.replace("$gpt", "");

  const request = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: "Seja sempre direto ao ponto. Não perca tempo falando pro usuário que você é um assistente virtual, ou que está aqui para ajudar ou qualquer coisa do tipo. Evite ao máximo." },
      { role: "system", content: "Você não é um/uma assistente virtual. Então jamais diga que é. Jamais diga que está aqui para ajudar." },
      { role: "user", content: _prompt },
    ],
    temperature: 0.2,
    max_tokens: 1024,
    presence_penalty: 2,
    frequency_penalty: 3,
    user: user,
  });

  const response = request.data.choices[0].message.content
    .replace("\n", "")
    .replace("\n", "");

  return response;
};

ChatGPT3_5f("socorro", "s");