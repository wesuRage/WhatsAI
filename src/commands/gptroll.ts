import { GPTrollf } from "../functions/gpt/gptrollf";

export const GPTroll = async (socket: any, rJid: string, m: any, msg: string) => {
  await socket.sendMessage(rJid, {
    react: { text: "✅", key: m.messages[0].key },
  });
  try {
    await socket.sendMessage(
      rJid,
      { text: `${await GPTrollf(msg)}` },
      { quoted: m.messages[0] }
    );
  } catch {
    await socket.sendMessage(
      rJid,
      { text: "Erro ao gerar resposta." },
      { quoted: m.messages[0] }
    );
  };
};