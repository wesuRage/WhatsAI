import { AntonioBotf } from "../functions/gpt/antonio-botf";

export const Ab = async (socket: any, rJid: string, m: any, msg: string) => {
  await socket.sendMessage(rJid, {
    react: { text: "✅", key: m.messages[0].key },
  });
  try {
    await socket.sendMessage(
      rJid,
      { text: `${await AntonioBotf(msg)}` },
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