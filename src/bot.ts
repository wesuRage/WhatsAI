import { Stab_Diff } from "./functions/stable_diffusion";
import { Dall_Var } from "./functions/dall-e/dall-var";
import { Dall_E } from "./functions/dall-e/dall-e";
import { ChatGPT } from "./functions/gpt/chatgpt";
import { GPTroll } from "./functions/gpt/gptroll";
import { xEvent, Restart } from "./core/utils";
import { Sticker } from "./functions/sticker";
import { proto } from "@adiwajshing/baileys";
import { connect } from "./core/connection";
import type { TProps } from "./core/TTypes";
import { gTTS } from "./functions/gpt/gtts";
import { DAN } from "./functions/gpt/dan";
import { Menu } from "./functions/menu";
import fs from "fs";
import { Dall_Get } from "./functions/dall-e/dall-get";

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

    // console.log(JSON.stringify(m, null, 2))
    const rJid = m.messages[0].key.remoteJid;

    if (
      m.type != "notify" ||
      rJid == "status@broadcast"
    )
      return;

    try {
      const body = NormalizeContent(m.messages[0].message);

      if (m.messages[0].message.listResponseMessage){
        const list = ["u1", "u2", "u3", "u4",
                      "v1", "v2", "v3", "v4"];
        const listresponse = m.messages[0].message.listResponseMessage
                            .singleSelectReply.selectedRowId;
        const listid = listresponse.split(" ")[0];
        
        await socket.sendMessage(
          rJid,
          { text: `o id é ${listid}` },
          { quoted: m.messages[0] }
        );
      };

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
          case "$menu":
            await socket.sendMessage(
              rJid,
              await Menu(),
              { quoted: m.messages[0] }
            );
            break;

          case "$gpt":

            if (msg == "$gpt") {
              await socket.sendMessage(
                rJid,
                { text: "Funcionando. Posso te ajudar em algo?" },
                { quoted: m.messages[0] }
              );
            } else {
              await socket.sendMessage(
                rJid,
                { react: { text: "✅", key: m.messages[0].key } }
              );
              try {
                await socket.sendMessage(
                  rJid,
                  { text: `${await ChatGPT(msg)}` },
                  { quoted: m.messages[0] }
                );
              } catch {
                await socket.sendMessage(
                  rJid,
                  { text: "Erro ao gerar resposta." },
                  { quoted: m.messages[0] }
                );
              }
            }

            break;

          case "$dan":
            if (msg == "$dan") {
              await socket.sendMessage(
                rJid,
                { text: "Funcionando. Posso te ajudar em algo?" },
                { quoted: m.messages[0] }
              );
            } else {
              await socket.sendMessage(
                rJid,
                { react: { text: "✅", key: m.messages[0].key } }
              );
              try {
                await socket.sendMessage(
                  rJid,
                  { text: `${await DAN(msg)}` },
                  { quoted: m.messages[0] }
                );
              } catch {
                await socket.sendMessage(
                  rJid,
                  { react: { text: "💖💖", key: m.messages[0].key } }
                );
              }
            }
            break;

          case "$gptroll":
            if (msg == "$gptroll") {
              await socket.sendMessage(
                rJid,
                { text: "Funcionando. Posso te ajudar em algo?" },
                { quoted: m.messages[0] }
              );
            } else {
              await socket.sendMessage(
                rJid,
                { react: { text: "✅", key: m.messages[0].key } }
              );
              try {
                await socket.sendMessage(
                  rJid,
                  { text: `${await GPTroll(msg)}` },
                  { quoted: m.messages[0] }
                );
              } catch {
                await socket.sendMessage(
                  rJid,
                  { text: "Erro ao gerar resposta." },
                  { quoted: m.messages[0] }
                );
              }
            }
            break;

          case "$gpt-tts":
            if (msg == "$gpt-tts") {
              await socket.sendMessage(
                rJid,
                { text: "Funcionando. Posso te ajudar em algo?" },
                { quoted: m.messages[0] }
              );
            } else {
              await socket.sendMessage(
                rJid,
                { react: { text: "✅", key: m.messages[0].key } }
              );
              await socket
                .sendMessage(
                  rJid,
                  {
                    audio: { url: `${await gTTS(msg)}` },
                    mimetype: "audio/mp4",
                    ptt: true,
                  },
                  { quoted: m.messages[0] }
                )
                .then(() => {
                  fs.unlinkSync("tmp/audio.mp3");
                });
            };
            break;

          case "$stab-diff":
            if (msg == "$stab-diff") {
              await socket.sendMessage(
                rJid,
                { text: "Funcionando. Posso te ajudar em algo?" },
                { quoted: m.messages[0] }
              );
            } else {
              await socket.sendMessage(
                rJid,
                { react: { text: "✅", key: m.messages[0].key } }
              );
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
            };

            if (
              messageType == "imageMessage" ||
              messageType == "videoMessage"
            ) {
              await socket.sendMessage(
                rJid,
                { react: { text: "✅", key: m.messages[0].key } }
              );

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
            };

            break;

          case "$dall-e":
            if (msg == "$dall-e") {
              await socket.sendMessage(
                rJid,
                { text: "Funcionando. Posso te ajudar em algo?" },
                { quoted: m.messages[0] }
              );
            } else {
              await socket.sendMessage(
                rJid,
                { react: { text: "✅", key: m.messages[0].key } }
              );
              try {
                const img = await Dall_E(msg)
                // const list = Dall_Get(img.data[0].id)

                xEvent.on("dall_e_gen", () => {
                  setTimeout(() => {
                    socket.sendMessage(
                      rJid,
                      { image: { url: "tmp/single.png" },  },
                      { quoted: m.messages[0] }
                    )
                    .then(() => {
                     fs.unlinkSync("tmp/single.png");
                    });
                  }, 3000);
                });

                xEvent.on("dall_e_gen4", () => {
                  socket.sendMessage(
                    rJid,
                    // { text: "a", jpegThumbnail: "tmp/four.png", buttonText: "options", sections: list },
                    { image: {url: "tmp/four.png" } },
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
              };
            };
            break

          case "$dall-var":
            if (messageQuoted) {
              messageType = Object.keys(messageQuoted)[0];
              media = messageQuoted[messageType];
            } else {
              messageType = Object.keys(message)[0];
              media = message[messageType];
            };

            if (messageType == "imageMessage") {
              await socket.sendMessage(
                rJid,
                { react: { text: "✅", key: m.messages[0].key } }
              );

              const variation = await Dall_Var(media)
              console.log(variation)

              await socket.sendMessage(
                rJid,
                { image: { url: `${variation}` } },
                { quoted: m.messages[0] }
              ).then(() => {
                fs.unlinkSync("tmp/variation.png")
                fs.unlinkSync("tmp/va.png")
              });
            } else {
              await socket.sendMessage(
                rJid,
                {
                  text: "Formato de mensagem inválido. \n\nEscolha uma imagem.",
                },
                { quoted: m.messages[0] }
              );
            };
            break;

          case "$test":
            const sections = [
              {
                title: "Upscale",
                rows: [
                  { title: "U1", rowId: "$gpt diga u1" },
                  { title: "U2", rowId: "u2" },
                  { title: "U3", rowId: "u3" },
                  { title: "U4", rowId: "u4" }
                ]
              },
              {
                title: "Variation",
                rows: [
                  { title: "V1", rowId: "v1" },
                  { title: "V2", rowId: "v2" },
                  { title: "V3", rowId: "v3" },
                  { title: "V4", rowId: "v4" }
                ]
              },
            ]
          
          const listMessage = {
            text: "",
            buttonText: "list",
            sections
          }

            await socket.sendMessage(rJid, listMessage)
            break;
        };
      };
    } catch (err) {
      console.log(err);
    };
  });

  // For production activate this:
  // Restart()
};
