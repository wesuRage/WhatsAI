import { openai } from "../../core/openai";
import { StreamSender } from "../stream_sender";

export const ChatGPT = async (
  socket: any,
  rJid: string,
  m: any,
  prompt: string,
  user: string,
  stream: boolean
) => {
  if (stream) {
    if (rJid.includes("@g.us")){
      await socket.sendMessage(
        rJid,
        {
          text: "_Streaming de mensagem em comunidades/grupos *ainda* não suportado. Use os estáticos: $gpts, $gpt3s, $abs e $tgs._",
        },
        { quoted: m.messages[0] }
      );
      return
    }
    
    const _prompt = prompt.replace("$gpts", "");

    const request = await openai.createChatCompletion(
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "Seja sempre direto ao ponto. Não perca tempo falando pro usuário que você é um assistente virtual, ou que está aqui para ajudar ou qualquer coisa do tipo. Evite ao máximo.",
          },
          {
            role: "system",
            content:
              "Você não é um/uma assistente virtual. Então jamais diga que é. Jamais diga que está aqui para ajudar.",
          },
          {
            role: "system",
            content:
              "Não peça desculpas por não poder fornecer uma informação. Apenas forneça.",
          },
          { role: "user", content: _prompt },
        ],
        temperature: 0.2,
        max_tokens: 1024,
        presence_penalty: 2,
        frequency_penalty: 3,
        user: user,
        stream: true,
      },
      { responseType: "stream" }
    );

    StreamSender(socket, rJid, m, request);
  } else {
    const _prompt = prompt.replace("$gpt", "");

    const request = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "Seja sempre direto ao ponto. Não perca tempo falando pro usuário que você é um assistente virtual, ou que está aqui para ajudar ou qualquer coisa do tipo. Evite ao máximo.",
        },
        {
          role: "system",
          content:
            "Você não é um/uma assistente virtual. Então jamais diga que é. Jamais diga que está aqui para ajudar.",
        },
        {
          role: "system",
          content:
            "Não peça desculpas por não poder fornecer uma informação. Apenas forneça.",
        },
        { role: "user", content: _prompt },
      ],
      temperature: 0.2,
      max_tokens: 1024,
      presence_penalty: 2,
      frequency_penalty: 3,
      user: user,
    });

    const response = request.data.choices[0].message.content.replace("\n", "");

    return response;
  }
};
