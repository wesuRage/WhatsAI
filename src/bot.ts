import { Stab_Diff } from "./functions/stable_diffusion";
import { xEvent } from "./core/utils";
import { Sticker } from "./functions/sticker";
import { proto } from "@whiskeysockets/baileys";
import { connect } from "./core/connection";
import type { TProps } from "./core/TTypes";
import fs from "fs";
import { Ab } from "./commands/ab";
import { Ab3 } from "./commands/ab3";
import { Tg } from "./commands/tg";
import { GPT } from "./commands/gpt";
import { GPT3 } from "./commands/gpt3";
import { GPTroll } from "./commands/gptroll";
import { generic } from "./functions/generic";
import { Dall_Var } from "./commands/dall-var";
import { Dall_E } from "./commands/dall-e";
import { Regras } from "./commands/regras";
import { Ban } from "./commands/ban";
import { Add } from "./commands/add";

import { Group } from "./core/groupMetadata";


const NormalizeContent = (msg: proto.IMessage) => {
  let props: TProps = { type: Object.keys(msg)[0] };

  // console.log(msg, props.type);

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

    console.log(JSON.stringify(m, null, 2));
    const rJid = m.messages[0].key.remoteJid;
    const participant = m.messages[0].key.participant;

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

        var gp = null;
        let hasAdmin = async (user: string) => false;

        if (rJid.endsWith("g.us")) { // temos que melhorar issoKKKKK
          gp = new Group(await socket.groupMetadata(rJid)); // OK importa pra mim essa porra aiKKKKK
          hasAdmin = async (user: string): Promise<boolean> =>
            gp.admins.includes(user);
        }

        let args = msg.split(' ').slice(1); 

        switch (msg.split(" ", 1)[0]) {
          case "$1290921":
            if (gp && hasAdmin(rJid)) {
              await Ban(socket, args, rJid, participant);
            } else {
              await socket.sendMessage(rJid, {
                text: "Você não possui permissão para usar este comando.",
              });
            }
            break;

          case "$1290921":
            await Add(socket, msg, rJid);
            break;

          case "$ab":
            if (msg == "$ab") {
              await generic(socket, rJid, m, msg);
            } else {
              await Ab(socket, rJid, m, msg);
            }
            break;

          case "$ab3":
            if (msg == "$ab3") {
              await generic(socket, rJid, m, msg);
            } else {
              await Ab3(socket, rJid, m, msg);
            }
            break;

          case "$tg":
            if (msg == "$tg") {
              await generic(socket, rJid, m, msg);
            } else {
              await Tg(socket, rJid, m, msg);
            }
            break;

          case "$gpt":
            if (msg == "$gpt") {
              await generic(socket, rJid, m, msg);
            } else {
              await GPT(socket, rJid, m, msg);
            }
            break;

          case "$gpt3":
            if (msg == "$gpt3") {
              await generic(socket, rJid, m, msg);
            } else {
              await GPT3(socket, rJid, m, msg);
            }
            break;

          case "$gptroll":
            if (msg == "$gptroll") {
              await generic(socket, rJid, m, msg);
            } else {
              await GPTroll(socket, rJid, m, msg);
            }
            break;

          case "$dall-e":
            if (msg == "$dall-e") {
              await generic(socket, rJid, m, msg);
            } else {
              await Dall_E(socket, rJid, m, msg);
            }
            break;

          case "$dall-var":
            if (messageQuoted) {
              messageType = Object.keys(messageQuoted)[0];
              media = messageQuoted[messageType];
            } else {
              messageType = Object.keys(message)[0];
              media = message[messageType];
            }

            await Dall_Var(socket, rJid, m, media, messageType);
            break;

          case "$regras":
            await Regras(socket, rJid, m);
            break;

          case "$stab-diff":
            if (msg == "$stab-diff") {
              await generic(socket, rJid, m, msg);
            } else {
              await socket.sendMessage(rJid, {
                react: { text: "✅", key: m.messages[0].key },
              });
              await socket.sendMessage(
                rJid,
                {
                  text: "Gerando imagem...\nModelo: stable-diffusion-2.1\nℹ️ A geração pode levar um tempo.",
                },
                { quoted: m.messages[0] }
              );
              await socket.sendMessage(rJid, {
                text: "ℹ️ Tempo de geração estimado: 40-60 minutos (pc ruim pra geração de imagens).",
              });

              try {
                await Stab_Diff(msg);
                xEvent.on("image_generated", () => {
                  socket
                    .sendMessage(
                      rJid,
                      { image: { url: "tmp/image.png" } },
                      { quoted: m.messages[0] }
                    )
                    .then(() => {
                      fs.unlinkSync("tmp/image.png");
                    });
                });
              } catch {
                await socket.sendMessage(
                  rJid,
                  { text: "Erro ao gerar imagem." },
                  { quoted: m.messages[0] }
                );
              }
            }
            break;

          case "$sticker":
            if (messageQuoted) {
              messageType = Object.keys(messageQuoted)[0];
              media = messageQuoted[messageType];
            } else {
              messageType = Object.keys(message)[0];
              media = message[messageType];
            }

            if (
              messageType == "imageMessage" ||
              messageType == "videoMessage"
            ) {
              await socket.sendMessage(rJid, {
                react: { text: "✅", key: m.messages[0].key },
              });

              await socket.sendMessage(
                rJid,
                { sticker: await Sticker(media) },
                { quoted: m.messages[0] }
              );
            } else {
              socket.sendMessage(
                rJid,
                {
                  text: "Formato de mensagem inválido. \n\nEscolha uma imagem ou um vídeo.",
                },
                { quoted: m.messages[0] }
              );
            }
            break;
        }
      }
    } catch (err) {
      console.log(err);
    }
  });
};
