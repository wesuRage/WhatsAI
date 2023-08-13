import { openai } from "../../core/openai";
import { StreamSender } from "../stream_sender";

export const ChatGPT3 = async (
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

    const _prompt = prompt.replace("$gpt", "");

    const request = await openai.createCompletion(
      {
        model: "text-davinci-003",
        temperature: 0.2,
        prompt: _prompt,
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
    const _prompt = prompt.replace("$gpts", "");

    const request = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: _prompt,
      temperature: 0.2,
      max_tokens: 1024,
      presence_penalty: 2,
      frequency_penalty: 3,
      user: user,
    });

    const response = request.data.choices[0].text.replace("\n", "");

    return response;
  }
};
