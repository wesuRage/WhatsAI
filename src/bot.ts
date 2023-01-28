import { ChatGPT } from "./functions/chatgpt";
import { connect } from "./core/connection";
import { gTTS } from "./functions/gtts";

export default async () => {
    const socket = await connect();

    socket.ev.on('messages.upsert', async (m) => {
        console.log(JSON.stringify(m, undefined, 2))

        try{

            const msg = m.messages[0].message.conversation || m.messages[0].message.extendedTextMessage.text;
            const rJid = m.messages[0].key.remoteJid;

            if (msg){
                console.log(msg)
                switch(msg.split(' ', 1)[0]){

                    case '$gpt':
                        await socket.sendMessage(rJid, {text: 'Gerando resposta...'}, {quoted: m.messages[0]});
                        await socket.sendMessage(rJid, {text: `${await ChatGPT(msg)}`}, {quoted: m.messages[0]});
                        break;

                    case '$gpt-tts':
                        await socket.sendMessage(rJid, {text: 'Gerando audio...'}, {quoted: m.messages[0]});
                        await gTTS(msg).then(
                            (audio) => {
                                setTimeout(() => {
                                    socket.sendMessage(rJid, {audio: {url: audio}, mimetype: 'audio/mp4', ptt: true}, {quoted: m.messages[0]})
                                }, 1000)
                            }
                        );
                        break;
                };
            };
        }catch{
            console.log('Message type not suported.');
        };
    });
};