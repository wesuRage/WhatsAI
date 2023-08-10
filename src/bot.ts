import { Sticker } from "./functions/sticker";
import { proto } from "@whiskeysockets/baileys";
import { connect } from "./core/connection";
import type { TProps } from "./core/TTypes";
import fs from "fs";
import { AbS } from "./commands/abStream";
import { TgS } from "./commands/tgStream";
import { GPTS } from "./commands/gptStream";
import { Ab } from "./commands/ab";
import { Tg } from "./commands/tg";
import { GPT } from "./commands/gpt";
import { generic } from "./functions/generic";
import { Dall_Var } from "./commands/dall-var";
import { Dall_E } from "./commands/dall-e";


const NormalizeContent = (msg: proto.IMessage) => {
  let props: TProps = { type: Object.keys(msg)[0] };

  if (props.type == "conversation") {
    props["content"] = msg.conversation;
  } else if (props.type == "extendedTextMessage") {
    let ctxInf = msg.extendedTextMessage.contextInfo;

    if (ctxInf) {
      let quotedMsg = ctxInf.quotedMessage;
      props["mentions"] = ctxInf.mentionedJid ? ctxInf.mentionedJid : [];
      if (quotedMsg) {
        props["quoted"] = quotedMsg;

        let quotedType = Object.keys(quotedMsg)[0];
        if (
          quotedType == "imageMessage" ||
          quotedType == "videoMessage" ||
          quotedType == "stickerMessage"
        )
          props["media"] = quotedMsg[quotedType];
      }
    }

    props["content"] = msg.extendedTextMessage.text;
  } else if (props.type == "imageMessage") {
    props["media"] = msg.imageMessage;

    props["content"] = msg.imageMessage.caption;
  } else if (props.type == "videoMessage") {
    props["media"] = msg.videoMessage;

    props["content"] = msg.videoMessage.caption;
  }
  return props;
};

export default async () => {
  console.clear();
  const socket = await connect();
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

      if (m.messages[0].message.listResponseMessage) {
        const listresponse =
          m.messages[0].message.listResponseMessage.singleSelectReply
            .selectedRowId;
        const listid = listresponse.split(" ")[0];

        await socket.sendMessage(
          rJid,
          { text: `o id é ${listid}` },
          { quoted: m.messages[0] }
        );
      }

      if (
        body.type == "conversation" ||
        body.type == "extendedTextMessage" ||
        body.type == "videoMessage" ||
        body.type == "imageMessage"
      ) {
        const msg = body.content;
        const message = m.messages[0].message;
        let messageType, media;

        const messageQuoted =
          body.type == "extendedTextMessage"
            ? message.extendedTextMessage.contextInfo.quotedMessage
            : false;

        switch (msg.split(" ", 1)[0]) {
          case "$ab":
            if (msg == "$ab") { await generic(socket, rJid, m, msg) }
            else { await Ab(socket, rJid, m, msg) } break;

          case "$tg":
            if (msg == "$tg") { await generic(socket, rJid, m, msg) }
            else { await Tg(socket, rJid, m, msg) } break;

          case "$gpt":
            if (msg == "$gpt") { await generic(socket, rJid, m, msg) }
            else { await GPT(socket, rJid, m, msg) } break;

          case "$abs":
            if (msg == "$abs") { await generic(socket, rJid, m, msg) }
            else { await AbS(socket, rJid, m, msg) } break;

          case "$tgs":
            if (msg == "$tgs") { await generic(socket, rJid, m, msg) }
            else { await TgS(socket, rJid, m, msg) } break;

          case "$gpts":
            if (msg == "$gpts") { await generic(socket, rJid, m, msg) }
            else { await GPTS(socket, rJid, m, msg) } break;

          case "$dall-e":
            if (msg == "$dall-e") { await generic(socket, rJid, m, msg) }
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
      }
    } catch (err) { console.log(err) }
  });
};
