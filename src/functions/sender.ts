import { IncomingMessage } from "http";

export const Sender = async (
    socket: any, 
    rJid: string, 
    m: any, 
    request: any
  ) => {
  const stream = (await request).data as unknown as IncomingMessage;
  let message_chunks = [];

  const placeholder = await socket.sendMessage(rJid, { text: "_Streaming de mensagem não suportado. Atualize seu WhatsApp ou use os estáticos: $gpts, $abs, $tgs._" }, { quoted: m.messages[0] })
  setTimeout(async () => {}, 500);
  
  stream.on("data", async (chunk: Buffer) => {
    const payloads = chunk.toString().split("\n\n");

    for (const payload of payloads) {
      if (payload.includes("[DONE]")) return;
      if (!payload.startsWith("data:")) return;

      const data = JSON.parse(payload.replace("data: ", ""));
      try {
        const chunk: undefined | string = data.choices[0].delta?.content;
        
        if (!chunk) return;
        setTimeout(async () => {
          message_chunks.push(chunk)
          let message = message_chunks.join("")
          
          await socket.sendMessage(rJid, { edit: placeholder.key, text: message }, { quoted: m.messages[0] });
        }, 300);

      } catch (error) {
        console.log(`Error with JSON.parse and ${payload}.\n${error}`);
      }
    }
  });
}