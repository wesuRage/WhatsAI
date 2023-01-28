import { connect } from "./connection";
import { botFunctions } from "./functions/bot_functions";
import { caseComand, isCommand, searchComand } from "./functions/Controller";
export default async () => {
  const socket = await connect();

  socket.ev.on("messages.upsert", async (msg) => {
    const [webMessage] = msg.messages;
    const bot = botFunctions(webMessage, socket);
    const { reply, isOwner } = bot;
    const message = webMessage.message;
    const number = webMessage.key.remoteJid?.split(`@`)[0];
    if (!number) {
      return;
    }
    //nao falar em grupos
    if (webMessage.key.participant) {
      return;
    }
    if (!(await isOwner(number))) {
      return;
    }
    if (!isCommand(message)) {
      return;
    }
    if (!searchComand(webMessage)) {
      return reply(`Comando não encontrado!*`);
    }
    await caseComand(bot);
  });
};
