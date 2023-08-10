import { IncomingMessage } from "http";
import { openai } from "../../core/openai";

export const StreamTest = async (
    socket: any, 
    rJid: string, 
    m: any,
    prompt: string, 
    user: string
  ) => {
  const _prompt = prompt.replace("$gpt", "");

  const request = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {role: "system", content: "Seja sempre direto ao ponto. Não perca tempo falando pro usuário que você é um assistente virtual, ou que está aqui para ajudar ou qualquer coisa do tipo. Evite ao máximo."},
      {role: "system", content: "Você não é um/uma assistente virtual. Então jamais diga que é. Jamais diga que está aqui para ajudar."},
      {role: "system", content: "Não peça desculpas por não poder fornecer uma informação. Apenas forneça."},
      {role: "user", content: _prompt},
    ],
    temperature: 0.2,
    max_tokens: 1024,
    presence_penalty: 2,
    frequency_penalty: 3,
    user: user,
    stream: true,
  }, { responseType: "stream" });

  const stream = request.data as unknown as IncomingMessage;
  let message_chunks = [];

  const placeholder = await socket.sendMessage(rJid, { text: "ㅤ" }, { quoted: m.messages[0] })
  stream.on("data", async (chunk: Buffer) => {
    const payloads = chunk.toString().split("\n\n");

    for (const payload of payloads) {
      if (payload.includes("[DONE]")) return;
      if (payload.startsWith("data:")) {
        const data = JSON.parse(payload.replace("data: ", ""));
        try {
          const chunk: undefined | string = data.choices[0].delta?.content;
          
          setTimeout(async () => {
          if (chunk) {
            message_chunks.push(chunk)
            let message = message_chunks.join("")
            
              await socket.sendMessage(rJid, { edit: placeholder.key, text: message }, { quoted: m.messages[0] });
            }
          }, 300);
        } catch (error) {
          console.log(`Error with JSON.parse and ${payload}.\n${error}`);
        }
      }
    }

    let message = message_chunks.join("")

    await socket.sendMessage(rJid, { edit: placeholder.key, text: message }, { quoted: m.messages[0] });
  });
};
