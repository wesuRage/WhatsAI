import { AntonioBot } from "../functions/gpt/antonio-botf";
import { ChatGPT3 } from "../functions/gpt/chatgpt3f";
import { ChatGPT } from "../functions/gpt/chatgptf";
import { TigresaVIP } from "../functions/gpt/tigresavipf";

export const Sender = async (socket: any, bot: string, rJid: string, m: any, msg: string) => {
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
    
    switch (bot){
      case "gpt": await ChatGPT(socket, rJid, m, msg, user, true); break;
      case "gpts": 
        await socket.sendMessage(
          rJid,
          { text: `${await ChatGPT(socket, rJid, m, msg, user, false)}` },
          { quoted: m.messages[0] }
        ); 
        break;

      case "gpt3": await ChatGPT3(socket, rJid, m, msg, user, true); break;
      case "gpt3s": 
        await socket.sendMessage(
          rJid,
          { text: `${await ChatGPT3(socket, rJid, m, msg, user, false)}` },
          { quoted: m.messages[0] }
        ); 
      break;

      case "ab": await AntonioBot(socket, rJid, m, msg, user, true); break;
      case "abs":  
        await socket.sendMessage(
          rJid,
          { text: `${await AntonioBot(socket, rJid, m, msg, user, false)}` },
          { quoted: m.messages[0] }
        ); 
        break;

      case "tg": await TigresaVIP(socket, rJid, m, msg, user, true); break;
      case "tgs":  
        await socket.sendMessage(
          rJid,
          { text: `${await TigresaVIP(socket, rJid, m, msg, user, false)}` },
          { quoted: m.messages[0] }
        ); 
        break;
    }
    
  } catch {
    await socket.sendMessage(
      rJid,
      { text: "Erro ao gerar resposta." },
      { quoted: m.messages[0] }
    );
  };
};