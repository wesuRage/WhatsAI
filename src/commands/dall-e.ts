import { xEvent } from "../core/utils";
import { Dall_Ef } from "../functions/dall-e/dall-ef";
import fs from "fs";

export const Dall_E = async (socket: any, rJid: string, m: any, msg: string) => {
  await socket.sendMessage(rJid, {
    react: { text: "✅", key: m.messages[0].key },
  });
  try {
    await Dall_Ef(msg);

    xEvent.on("dall_e_gen", () => {
      setTimeout(() => {
        socket
          .sendMessage(
            rJid,
            { image: { url: "tmp/single.png" } },
            { quoted: m.messages[0] }
          )
          .then(() => {
            fs.unlinkSync("tmp/single.png");
          });
      }, 3000);
    });

    xEvent.on("dall_e_gen4", () => {
      socket
        .sendMessage(
          rJid,
          { image: { url: "tmp/four.png" } },
          { quoted: m.messages[0] }
        )
        .then(() => {
          fs.unlinkSync("tmp/four.png");
        });
    });
  } catch {
    await socket.sendMessage(
      rJid,
      { text: "Falha ao gerar imagem." },
      { quoted: m.messages[0] }
    );
  }
}