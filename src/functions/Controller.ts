import { data, comand_list } from "../config/index";
import { proto } from "@adiwajshing/baileys";
import { Bot } from "../interfaces/Bot";
import comandos from "../comands/comands";
import menu from "../comands/menu";
import { caneta } from "../comands/caneta";
import { gpt } from "../comands/chatgpt";

export function isCommand(msg: proto.IMessage) {
  const text =
    msg?.conversation ||
    msg?.imageMessage?.caption ||
    msg?.extendedTextMessage?.text ||
    msg.videoMessage?.caption ||
    msg.templateButtonReplyMessage?.selectedId ||
    msg.buttonsResponseMessage?.selectedButtonId;

  if (!text) return;

  try {
    let prefix = text.split("")[0];
    if (prefix == data.prefix) {
      return true;
    } else return false;
  } catch (err) {
    return false;
  }
}

export function searchComand(Webmessage: proto.IWebMessageInfo) {
  const { message } = Webmessage;

  const comand = parameters(extractComand(message));
  let exists = comand_list.find((str) => str.comand == comand[0]);
  if (exists) {
    return true;
  } else {
    return false;
  }
}
export function parameters(comand: string) {
  if (!comand) {
    return [comand];
  }
  const array = comand.split(" ").filter((x) => {
    return x.length > 1;
  });
  let parametro = array.filter((element) => element != array[0]);

  return [array[0], parametro.toString().replace(/,/g, " ")];
}
//cases de comandos
export async function caseComand(bot: Bot) {
  const comand = parameters(extractComand(bot.webMessage.message));

  //cases dos comands
  switch (comand[0]) {
    case `menu`:
      await menu(bot);
      break;
    case `comandos`:
      await comandos(bot);
      break;
    case `caneta`:
      await caneta(bot);
      break;
    case `gpt`:
      await gpt(bot);
      break;
    default:
      bot.reply(`erro interno!`);
      break;
  }
}
//extrair comando da mensagem
export function extractComand(msg: proto.IMessage | any) {
  const texto =
    msg.conversation ||
    msg.imageMessage?.caption ||
    msg.extendedTextMessage?.text ||
    msg.videoMessage?.caption ||
    msg.templateButtonReplyMessage?.selectedId ||
    msg.buttonsResponseMessage?.selectedButtonId;
  const comand = texto?.replace(data.prefix, "");

  return comand;
}
