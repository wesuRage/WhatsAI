import { ChatGPT } from "./functions/chatgpt";
import { connect } from "./core/connection";
import { xEvent } from "./core/xevents";
import { gTTS } from "./functions/gtts";
import { Mid_Diff } from "./functions/midjourney_diffusion";
import { Sing } from "./functions/sing";
import { sticker } from "./functions/sticker";

import fs from "fs";
import { proto } from "@adiwajshing/baileys";

type TProps = {
  content?: string;
  media?: any;
  mentions?: string[];
  type: string;
};

const NormalizeContent = (msg: proto.IMessage) => {
  let props: TProps = { type: Object.keys(msg)[0] };

  console.log(msg, props.type);

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

    const rJid = m.messages[0].key.remoteJid;

    if (
      // !m.messages[0].key.fromMe ||
      m.type != "notify" ||
      rJid == "status@broadcast"
    )
      return;

    try {
      const body = NormalizeContent(m.messages[0].message);

      // Tratamento da mensagem.
      if (
        body.type == "conversation" ||
        body.type == "extendedTextMessage" ||
        body.type == "videoMessage" ||
        body.type == "imageMessage"
      ) {
        const msg = body.content;

        console.log(JSON.stringify(m, undefined, 2));

        switch (msg.split(" ", 1)[0]) {
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
                { text: "Gerando resposta..." },
                { quoted: m.messages[0] }
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
                { text: "Gerando audio..." },
                { quoted: m.messages[0] }
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
                  fs.unlink("tmp/audio.mp3", (err: any) => {
                    if (err) throw err;
                  });
                });
            }

            break;

          case "$mid-diff":
            if (msg == "$mid-diff") {
              await socket.sendMessage(
                rJid,
                { text: "Funcionando. Posso te ajudar em algo?" },
                { quoted: m.messages[0] }
              );
            } else {
              await socket.sendMessage(
                rJid,
                {
                  text: "Gerando imagem...\nModelo: midjourney-diffusion\nℹ️ A geração pode levar um tempo.",
                },
                { quoted: m.messages[0] }
              );
              await socket.sendMessage(rJid, {
                text: "ℹ️ Tempo de geração estimado: 40-60 minutos (pc ruim pra geração de imagens).",
              });

              try {
                await Mid_Diff(msg);
                xEvent.on("image_generated", () => {
                  // console.log("fim");
                  socket
                    .sendMessage(
                      rJid,
                      { image: { url: "tmp/image.png" } },
                      { quoted: m.messages[0] }
                    )
                    .then(() => {
                      fs.unlink("tmp/image.png", (err) => {
                        if (err) throw err;
                      });
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

          case "$sing":
            if (msg == "$sing") {
              await socket.sendMessage(
                rJid,
                { text: "Funcionando. Posso te ajudar em algo?" },
                { quoted: m.messages[0] }
              );
            } else {
              await socket.sendMessage(
                rJid,
                { text: "Cantando música..." },
                { quoted: m.messages[0] }
              );

              try {
                await Sing(msg, () => {
                  xEvent.on("song_not_found", async () => {
                    await socket.sendMessage(
                      rJid,
                      { text: "Música não encontrada." },
                      { quoted: m.messages[0] }
                    );
                    return;
                  });

                  socket
                    .sendMessage(
                      rJid,
                      {
                        audio: { url: "tmp/audio.mp3" },
                        mimetype: "audio/mp4",
                        ptt: true,
                      },
                      { quoted: m.messages[0] }
                    )
                    .then(() => {
                      fs.unlink("tmp/audio.mp3", (err: any) => {
                        if (err) throw err;
                      });
                    });
                });
              } catch {
                await socket.sendMessage(
                  rJid,
                  { text: "Erro ao procurar música." },
                  { quoted: m.messages[0] }
                );
              }
            }
            break;

          // sticker command
          case "$sticker":
            const message = m.messages[0].message;
            let messageType, media;

            const messageQuoted =
              body.type == "extendedTextMessage"
                ? message.extendedTextMessage.contextInfo.quotedMessage
                : false;

            if (messageQuoted) {
              messageType = Object.keys(messageQuoted)[0];
              media = messageQuoted[messageType];
            } else {
              messageType = Object.keys(message)[0];
              media = message[messageType];
            }

            console.log(media, messageType, message);

            if (
              messageType == "imageMessage" ||
              messageType == "videoMessage"
            ) {
              socket.sendMessage(
                rJid,
                { text: "Aguarde um momento... gerando sticker!" },
                { quoted: m.messages[0] }
              );

              await socket.sendMessage(
                rJid,
                { sticker: await sticker(media) },
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
        }
      }
    } catch (err) {
      console.log(err);
    }
  });

  // For production activate props['
  //'] restart()
};

const restart = () => {
  const _30minutes = 1000 * 60 * 30;

  setTimeout(() => {
    process.exit(0);
  }, _30minutes);
};
