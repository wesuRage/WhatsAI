import { data } from "../config";
import { downloadImage } from "../functions/downloadContent";
import { Bot } from "../interfaces/Bot";
import fs from "fs";
import { addManoelGomesToImage } from "manoel-gomes";
export async function caneta(bot: Bot) {
  const { isImage, sendImage, reply, webMessage } = bot;
  const imageMessage = isImage
    ? webMessage.message?.imageMessage
    : webMessage.message?.extendedTextMessage?.contextInfo?.quotedMessage
        ?.imageMessage;

  if (!imageMessage) {
    return reply(`Marque uma imagem com o comando ${data.prefix}caneta`);
  }
  // await reply(`um segundinho...`);
  if (imageMessage) {
    // const file = await downloadImage(imageMessage);
    // if (file) {
    //   let converter = Buffer.from(addManoelGomesToImage(file, file));
    //   await sendImage(converter);
    //   try {
    //     fs.unlinkSync(file);
    //   } catch (err) {
    //     console.log(`erro ao deletar[!]`);
    //   }
    return reply(
      "Ainda não funciona,preciso fazer a lib enviar o buffer pronto"
    );
  }
}
