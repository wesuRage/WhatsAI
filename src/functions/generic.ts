export const generic = async (socket: any, rJid: string, m: any, msg: string) => {
  await socket.sendMessage(
    rJid,
    { text: "Funcionando. Posso te ajudar em algo?" },
    { quoted: m.messages[0] }
  );
}