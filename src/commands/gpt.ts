import { ChatGPT3_5f } from "../functions/gpt/chatgpt3-5f";
import { StreamTest } from "../functions/gpt/teste";

export const GPT = async (socket: any, rJid: string, m: any, msg: string) => {
  await socket.sendMessage(rJid, {
    react: { text: "✅", key: m.messages[0].key },
  });
  try {
    let user: string;

    if (m.messages[0].key.participant) {
      user = m.messages[0].key.participant;
    } else {
      user = rJid;
    }
    await StreamTest(socket, rJid, m, msg, user);

  } catch {
    await socket.sendMessage(
      rJid,
      { text: "Erro ao gerar resposta." },
      { quoted: m.messages[0] }
    );
  };
};
