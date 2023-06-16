import { Stab_Diff } from "./functions/stable_diffusion";
import { Dall_Var } from "./functions/dall-e/dall-var";
import { Dall_E } from "./functions/dall-e/dall-e";
import { ChatGPT } from "./functions/gpt/chatgpt";
import { GPTroll } from "./functions/gpt/gptroll";
import { xEvent, Restart, IsAdmin } from "./core/utils";
import { Sticker } from "./functions/sticker";
import { proto } from "@WhiskeySockets/Baileys";
import { connect } from "./core/connection";
import type { TProps } from "./core/TTypes";
import fs from "fs";
import { AntonioBot } from "./functions/gpt/antonio-bot";
import { ChatGPT3_5 } from "./functions/gpt/chatgpt3-5";
import { AntonioBot3_5 } from "./functions/gpt/antonio-bot3-5";

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

    // console.log(JSON.stringify(m, null, 2));
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
          case "$":
            let numeros: string[];
            let usuarioMarcado: string;
            const usuarioQueEnviouComando = m.messages[0].key.participant;

            if (!IsAdmin(socket, rJid, usuarioQueEnviouComando)) {
              socket.sendMessage(
                rJid,
                { text: "baitola" },
                { quoted: m.messages[0] }
              );

              return;
            }

            if (messageQuoted) {
              usuarioMarcado =
                m.messages[0].message.extendedTextMessage.contextInfo
                  .participant;
            } else {
              usuarioMarcado = msg.split(" ", 1)[0];
            }

            socket.sendMessage(
              rJid,
              { text: "indio" },
              { quoted: m.messages[0] }
            );

            break;

          case "zap":

            // for (let i = 79900000; i < 100000000; i++) {
            for (let i = 85005426; i < 100000000; i++) {
              
              console.log(i)
              const [result] = await socket.onWhatsApp(`5551${i}\n`);

              if (result !== undefined) {
                console.log(`número 5551${i} existe no whatsapp`)
                fs.appendFileSync(`./tmp/51.txt`, `5551${i}\n`);
              }
            }



            // const id = `5541${i}`;
            // console.log(id)

            // const [result] = await socket.onWhatsApp(id);
            //   if (result !== undefined) await socket.sendMessage(
            //       rJid,
            //       { text: `wa.me/${id}` }
            //     );

            break;

          case "$ab":
            if (msg == "$ab") {
              await socket.sendMessage(
                rJid,
                { text: "Funcionando. Posso te ajudar em algo?" },
                { quoted: m.messages[0] }
              );
            } else {
              await socket.sendMessage(rJid, {
                react: { text: "✅", key: m.messages[0].key },
              });
              try {
                let user: string;

                if (m.messages[0].key.participant) {
                  user = m.messages[0].key.participant;
                } else {
                  user = rJid;
                }

                await socket.sendMessage(
                  rJid,
                  { text: `${await AntonioBot3_5(msg, user)}` },
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

          case "$ab3":
            if (msg == "$ab3") {
              await socket.sendMessage(
                rJid,
                { text: "Funcionando. Posso te ajudar em algo?" },
                { quoted: m.messages[0] }
              );
            } else {
              await socket.sendMessage(rJid, {
                react: { text: "✅", key: m.messages[0].key },
              });
              try {
                await socket.sendMessage(
                  rJid,
                  { text: `${await AntonioBot(msg)}` },
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

          case "$gpt":
            if (msg == "$gpt") {
              await socket.sendMessage(
                rJid,
                { text: "Funcionando. Posso te ajudar em algo?" },
                { quoted: m.messages[0] }
              );
            } else {
              await socket.sendMessage(rJid, {
                react: { text: "✅", key: m.messages[0].key },
              });
              try {
                let user: string;

                if (m.messages[0].key.participant) {
                  user = m.messages[0].key.participant;
                } else {
                  user = rJid;
                }

                await socket.sendMessage(
                  rJid,
                  { text: `${await ChatGPT3_5(msg, user)}` },
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

          case "$gpt3":
            if (msg == "$gpt3") {
              await socket.sendMessage(
                rJid,
                { text: "Funcionando. Posso te ajudar em algo?" },
                { quoted: m.messages[0] }
              );
            } else {
              await socket.sendMessage(rJid, {
                react: { text: "✅", key: m.messages[0].key },
              });
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

          case "$gptroll":
            if (msg == "$gptroll") {
              await socket.sendMessage(
                rJid,
                { text: "Funcionando. Posso te ajudar em algo?" },
                { quoted: m.messages[0] }
              );
            } else {
              await socket.sendMessage(rJid, {
                react: { text: "✅", key: m.messages[0].key },
              });
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

          case "$stab-diff":
            if (msg == "$stab-diff") {
              await socket.sendMessage(
                rJid,
                { text: "Funcionando. Posso te ajudar em algo?" },
                { quoted: m.messages[0] }
              );
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

          case "$dall-e":
            if (msg == "$dall-e") {
              await socket.sendMessage(
                rJid,
                { text: "Funcionando. Posso te ajudar em algo?" },
                { quoted: m.messages[0] }
              );
            } else {
              await socket.sendMessage(rJid, {
                react: { text: "✅", key: m.messages[0].key },
              });
              try {
                await Dall_E(msg);

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
            break;

          case "$dall-var":
            if (messageQuoted) {
              messageType = Object.keys(messageQuoted)[0];
              media = messageQuoted[messageType];
            } else {
              messageType = Object.keys(message)[0];
              media = message[messageType];
            }

            if (messageType == "imageMessage") {
              await socket.sendMessage(rJid, {
                react: { text: "✅", key: m.messages[0].key },
              });

              const variation = await Dall_Var(media);
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
            break;

          case "$ban":
            break;
        }
      }
    } catch (err) {
      console.log(err);
    }
  });

  // For production activate this:
  // Restart();
};
