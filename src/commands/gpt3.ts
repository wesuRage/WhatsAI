import { ChatGPTf } from "../functions/gpt/chatgptf";

export const GPT3 = async (socket: any, rJid: string, m: any, msg: string) => {
  await socket.sendMessage(rJid, {
    react: { text: "✅", key: m.messages[0].key },
  });
  try {
    await socket.sendMessage(
      rJid,
      { text: `${await ChatGPTf(msg)}` },
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
