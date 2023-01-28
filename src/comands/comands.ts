import { Bot } from "../interfaces/Bot";
import { comand_list, data } from "../config/index";

export default async function comandos(bot: Bot) {
  const { reply } = bot;
  let template = ` Comandos:\n`;
  comand_list.map((obj) => {
    template += `\n*${data.prefix}${obj.comand}* ➔ _${obj.resume}_\n`;
  });
  return reply(template);
}
