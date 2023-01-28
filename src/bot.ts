import { ChatGPT } from "./chatgpt";
import { connect } from "./connection"

export default async () => {
    const socket = await connect();

    socket.ev.on('messages.upsert', async (m) => {
        console.log(JSON.stringify(m, undefined, 2))

        try{
            const msg = m.messages[0].message.conversation || m.messages[0].message.extendedTextMessage.text;
    
            if (m.messages[0].message.conversation || m.messages[0].message.extendedTextMessage.text){
                const prefix = msg.split(' ', 1)[0];
                const rJid = m.messages[0].key.participant || m.messages[0].key.remoteJid;
    
                console.log(msg)
                if (prefix == '$gpt'){
                    await socket.sendMessage(rJid, {text: 'Gerando resposta...'});
                    await socket.sendMessage(rJid, {text: `${await ChatGPT({prompt: msg})}`});
                };  
            };
        }catch{
            console.log(`Error handling message type: ${m.messages[0].message}`);
        };
    });
};