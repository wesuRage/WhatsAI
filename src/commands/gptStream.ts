import { ChatGPT3_5f } from "../functions/gpt/chatgpt3-5f";

export const GPTS = async (socket: any, rJid: string, m: any, msg: string) => {
  await socket.sendMessage(rJid, {
    react: { text: "✅", key: m.messages[0].key },
  });
  try {
    let user: string;

    if (m.messages[0].key.participant) {
      user = m.messages[0].key.participant;
    } else {
      user = rJid;
    };

    await ChatGPT3_5f(socket, rJid, m, msg, user, true);

  } catch {
    await socket.sendMessage(
      rJid,
      { text: "Erro ao gerar resposta." },
      { quoted: m.messages[0] }
    );
  };
};