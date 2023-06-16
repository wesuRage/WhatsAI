import fs from "fs";
import { Dall_Varf } from "../functions/dall-e/dall-varf";

export const Dall_Var = async (socket: any, rJid: string, m: any, media: any, messageType: any) => {
  if (messageType == "imageMessage") {
    await socket.sendMessage(rJid, {
      react: { text: "✅", key: m.messages[0].key },
    });

    const variation = await Dall_Varf(media);
    console.log(variation);

    await socket
      .sendMessage(
        rJid,
        { image: { url: `${variation}` } },
        { quoted: m.messages[0] }
      )
      .then(() => {
        fs.unlinkSync("tmp/variation.png");
        fs.unlinkSync("tmp/va.png");
      });
  } else {
    await socket.sendMessage(
      rJid,
      {
        text: "Formato de mensagem inválido. \n\nEscolha uma imagem.",
      },
      { quoted: m.messages[0] }
    );
  }
}


