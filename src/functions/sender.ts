import { log } from "console";
import { IncomingMessage } from "http";

export const Sender = async (
  socket: any,
  rJid: string,
  m: any,
  request: any
) => {
  
  const placeholder = await socket.sendMessage(
    rJid,
    {
      text: "_Streaming de mensagem não suportado. Atualize seu WhatsApp ou use os estáticos: $gpt, $ab, $tg._",
    },
    { quoted: m.messages[0] }
  );

  const stream = request.data as unknown as IncomingMessage;
  let message_chunks = [];

  stream.on("data", (chunk: Buffer) => {
    const payloads = chunk.toString().split("\n\n");
    log(payloads)

    for (const payload of payloads) {
      if (payload.includes("[DONE]")) {
        let message = message_chunks.join("");
        socket.sendMessage(
          rJid,
          { edit: placeholder.key, text: message },
          { quoted: m.messages[0] }
        );
        return;
      }
      if (!payload.startsWith("data:")) return;

      const data = JSON.parse(payload.replace("data: ", ""));
      const chunk: undefined | string = data.choices[0].delta?.content;
      if (!chunk) return;
      message_chunks.push(chunk);

      let message = message_chunks.join("");

      socket.sendMessage(
        rJid,
        { edit: placeholder.key, text: message },
        { quoted: m.messages[0] }
      );
    }
  });
};
