import { IncomingMessage } from "http";

export const StreamSender = async (
  socket: any,
  rJid: string,
  m: any,
  request: any
) => {
  const placeholder = await socket.sendMessage(
    rJid,
    {
      text: "_Streaming de mensagem não suportado. Atualize seu WhatsApp ou use os estáticos: $gpts, $gpt3s, $abs e $tgs._",
    },
    { quoted: m.messages[0] }
  );

  const stream = request.data as unknown as IncomingMessage;
  let message_chunks = [];

  stream.on("data", async (chunk: Buffer) => {
    const payloads = chunk.toString().split("\n\n");

    // gambiarra pra pegar o objeto certo
    const index =
      payloads.length == 3
        ? payloads.length - 2
        : payloads.length == 2
        ? payloads.length - 2
        : 0;
    const data = payloads[index].replace("data: ", "");

    if (data == "[DONE]") return;

    const object = JSON.parse(data);
    message_chunks.push(object.choices[0].delta.content);

    let message = message_chunks.join("");
    setTimeout(async () => {
      await socket.sendMessage(
        rJid,
        { edit: placeholder.key, text: message },
        { quoted: m.messages[0] }
      );
    }, 200);
  });
};
