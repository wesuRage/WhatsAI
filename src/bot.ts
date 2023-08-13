import { Connect } from "./core/connection";
import { Generic } from "./functions/generic";
import { NormalizeContent } from "./core/utils";

import { Dall_Var } from "./commands/dall-var";
import { Dall_E } from "./commands/dall-e";
import { Sticker } from "./functions/sticker";
import { Sender } from "./commands/sender";

import fs from "fs";


export default async () => {
  console.clear();
  const socket = await Connect();
  console.log("Running...");

  socket.ev.on("messages.upsert", async (m) => {
    if (!fs.existsSync("./tmp/")) {
      fs.mkdirSync("./tmp/");
    }

    const Logs = (m: object, on: boolean) => {
      if (on) {
        console.log(JSON.stringify(m, undefined, 2));
      }
    };

    Logs(m, false);

    const rJid = m.messages[0].key.remoteJid;
    if (m.type != "notify" || rJid == "status@broadcast") return;

    try {
      const body = NormalizeContent(m.messages[0].message);

      if (!(
        body.type == "conversation" ||
        body.type == "extendedTextMessage" ||
        body.type == "videoMessage" ||
        body.type == "imageMessage"
      )) return;

      const msg = body.content;
      const message = m.messages[0].message;
      let messageType, media;

      const messageQuoted =
        body.type == "extendedTextMessage"
          ? message.extendedTextMessage.contextInfo.quotedMessage
          : false;

      switch (msg.trim().split(" ", 1)[0]) {
        case "$ab":
          if (msg == "$ab") { await Generic(socket, rJid, m, msg) }
          else { await Sender(socket, "ab", rJid, m, msg) } break;

        case "$tg":
          if (msg == "$tg") { await Generic(socket, rJid, m, msg) }
          else { await Sender(socket, "tg", rJid, m, msg) } break;

        case "$gpt":
          if (msg == "$gpt") { await Generic(socket, rJid, m, msg) }
          else { await Sender(socket, "gpt", rJid, m, msg) } break;

        case "$gpt3":
          if (msg == "$gpt3") { await Generic(socket, rJid, m, msg) }
          else { await Sender(socket, "gpt3", rJid, m, msg) } break;

        case "$abs":
          if (msg == "$abs") { await Generic(socket, rJid, m, msg) }
          else { await Sender(socket, "abs", rJid, m, msg) } break;

        case "$tgs":
          if (msg == "$tgs") { await Generic(socket, rJid, m, msg) }
          else { await Sender(socket, "tgs", rJid, m, msg) } break;

        case "$gpts":
          if (msg == "$gpts") { await Generic(socket, rJid, m, msg) }
          else { await Sender(socket, "gpts", rJid, m, msg) } break;

        case "$gpt3s":
          if (msg == "$gpt3s") { await Generic(socket, rJid, m, msg) }
          else { await Sender(socket, "gpt3s", rJid, m, msg) } break;

        case "$dall-e":
          if (msg == "$dall-e") { await Generic(socket, rJid, m, msg) }
          else { await Dall_E(socket, rJid, m, msg) } break;

        case "$dall-var":
          if (messageQuoted) {
            messageType = Object.keys(messageQuoted)[0];
            media = messageQuoted[messageType];
          } else {
            messageType = Object.keys(message)[0];
            media = message[messageType];
          }

          await Dall_Var(socket, rJid, m, media, messageType); break;

        case "$sticker":
          if (messageQuoted) {
            messageType = Object.keys(messageQuoted)[0];
            media = messageQuoted[messageType];
          } else {
            messageType = Object.keys(message)[0];
            media = message[messageType];
          }

          if (messageType == "imageMessage" || messageType == "videoMessage") {
            await socket.sendMessage(rJid, { react: { text: "✅", key: m.messages[0].key }});

            await socket.sendMessage(
              rJid, { sticker: await Sticker(media) }, { quoted: m.messages[0] }
            );
          } else {
            socket.sendMessage(
              rJid,
              { text: "Formato de mensagem inválido. \n\nEscolha uma imagem ou um vídeo." }, { quoted: m.messages[0] }
            );
          }
          break;
      }
      
    } catch (err) { console.log(err) }
  });
};
