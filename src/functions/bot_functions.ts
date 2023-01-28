import { proto } from "@adiwajshing/baileys";
import { data } from "../config/index";
import { Bot } from "../interfaces/Bot";
import { Menu } from "../interfaces/Menu";
import fs from "fs";
export const botFunctions = (
  webMessage: proto.IWebMessageInfo,
  socket: any
): Bot => {
  const { remoteJid } = webMessage.key;
  const isImage = webMessage.message?.imageMessage ? true : false;
  const botInfo = socket.user;
  const isOwner = async (number: string) => {
    let numberFormated = number.split(`@`)[0];
    for await (let numberOw of data.owner) {
      if (numberFormated == numberOw) {
        return true;
      }
    }

    return false;
  };

  const sendText = async (txt: string) => {
    return socket.sendMessage(remoteJid, { text: txt });
  };
  const reply = async (txt: string) => {
    return socket.sendMessage(remoteJid, { text: txt }, { quoted: webMessage });
  };
  const sendMenu = async (templateMessage: Menu) => {
    return socket.sendMessage(remoteJid, templateMessage);
  };
  const sendImage = async (
    pathOrBuffer: Buffer | string,
    caption?: string,
    isReply?: boolean
  ) => {
    const image =
      pathOrBuffer instanceof Buffer
        ? pathOrBuffer
        : fs.readFileSync(pathOrBuffer);
    const params = {
      image,
      caption: caption,
    };
    let options = isReply == true ? { quoted: webMessage } : {};
    return socket.sendMessage(remoteJid, params, options);
  };
  return {
    remoteJid,
    botInfo,
    sendImage,
    isImage,
    isOwner,
    reply,
    sendText,
    webMessage,
    sendMenu,
    socket,
  };
};
