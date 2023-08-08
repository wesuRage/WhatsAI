import {WASocket} from '@whiskeysockets/baileys'

export const Add = async (socket: WASocket, numero: string, groupID: string) => {
  const num = numero.replace('$add ', '').replace('@', '')
   
  await socket.groupParticipantsUpdate(
    groupID, 
    [num+"@s.whatsapp.net"],
    "add"
  );
};