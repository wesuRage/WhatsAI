import { Group } from "../core/groupMetadata";
import { WASocket } from "@whiskeysockets/baileys";

const button = [
  { buttonId: "add", buttonText: { displayText: "Desfazer" }, type: 1 },
];

export const Ban = async (
  socket: WASocket,
  args: string[],
  groupID: string,
  participant: string
) => {
  const num = args[0].replace("@", "");
  const motivo = args.slice(1).join(' '); // remove o numero

  const group = new Group(await socket.groupMetadata(groupID));

  if (group.admins.includes(num + "@s.whatsapp.net"))
    return await socket.sendMessage(groupID, {
      text: "Você não pode remover um administrador!",
    });

  if (motivo.length <= 5) return await socket.sendMessage(groupID, {text: 'Você deve citar um motivo!!'})

  const staffCyber = "120363143649754413@g.us";
  await socket
    .sendMessage(staffCyber, {
      text: [
        "*LOG - Banimento*\n",
        `Usuário: ${num}`,
        `Admin: @${participant.replace("@s.whatsapp.net", "")}`,
        `Motivo:\n  \`\`\`\n${motivo}\n\`\`\``,
      ].join("\n"),
      mentions: [participant],
    })
    .then(
      async () =>
        await socket.groupParticipantsUpdate(
          groupID,
          [num + "@s.whatsapp.net"],
          "remove"
        )
    );
};
