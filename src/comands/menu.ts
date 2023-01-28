import path from "path";
import { data } from "../config";
import { Bot } from "../interfaces/Bot";

export default async function menu(bot: Bot) {
  const { webMessage, sendMenu } = bot;

  const menu = {
    image: { url: path.resolve("assets", "img", "rock.jpeg") },
    caption: `Painel de controle\n*${data.botname}*\n\nDigite *$comandos* para ver todos os comandos`,
    footer: `by: ${data.owner_name}`,
  };

  return await sendMenu(menu);
}
