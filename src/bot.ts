import { ChatGPT } from "./functions/chatgpt";
import { connect } from "./core/connection";
import { xEvent } from "./core/xevents";
import { gTTS } from "./functions/gtts";
import { Mid_Diff } from "./functions/midjourney_diffusion";
import { Sing } from "./functions/sing";
import fs from 'fs';

export default async () => {
    const socket = await connect();

    socket.ev.on('messages.upsert', async (m) => {   
        console.log(JSON.stringify(m, undefined, 2));

        if(!fs.existsSync("./tmp/")){fs.mkdirSync("./tmp/")};

        try{

            const msg = m.messages[0].message.conversation || m.messages[0].message.extendedTextMessage.text;
            const rJid = m.messages[0].key.remoteJid;

            if(msg){
                console.log(msg)
                
                switch(msg.split(' ', 1)[0]){

                    case '$gpt':

                        if(msg == '$gpt'){
                            await socket.sendMessage(rJid, {text: 'Funcionando. Posso te ajudar em algo?'}, {quoted: m.messages[0]});
                        }else{
                            await socket.sendMessage(rJid, {text: 'Gerando resposta...'}, {quoted: m.messages[0]});
                            try{
                                await socket.sendMessage(rJid, {text: `${await ChatGPT(msg)}`}, {quoted: m.messages[0]});
                            }catch{
                                await socket.sendMessage(rJid, {text: 'Erro ao gerar resposta.'}, {quoted: m.messages[0]});
                            };
                        };
                        
                        break;

                    case '$gpt-tts':

                        if(msg == '$gpt-tts'){
                            await socket.sendMessage(rJid, {text: 'Funcionando. Posso te ajudar em algo?'}, {quoted: m.messages[0]});
                        }else{
                            await socket.sendMessage(rJid, {text: 'Gerando audio...'}, {quoted: m.messages[0]});
                            await socket.sendMessage(rJid, {audio: {url: `${await gTTS(msg)}`}, mimetype: 'audio/mp4', ptt: true}, {quoted: m.messages[0]})
                            .then(() => {
                                fs.unlink('tmp/audio.mp3', (err: any) => {
                                    if(err) throw err;
                                });
                            });
                        };

                        break;

                    case '$mid-diff':

                        if(msg == '$mid-diff'){
                            await socket.sendMessage(rJid, {text: 'Funcionando. Posso te ajudar em algo?'}, {quoted: m.messages[0]});
                        }else{
                            await socket.sendMessage(rJid, {text: 'Gerando imagem...\nModelo: midjourney-diffusion\nℹ️ A geração pode levar um tempo.'}, {quoted: m.messages[0]});
                            await socket.sendMessage(rJid, {text: 'ℹ️ Tempo de geração estimado: 40-60 minutos (pc ruim pra geração de imagens).'});
                            
                            try{
                                await Mid_Diff(msg)
                                xEvent.on("image_generated", () => {
                                    console.log("fim")
                                    socket.sendMessage(rJid, {image: {url: 'tmp/image.png'}}, {quoted: m.messages[0]})
                                    .then(() => {
                                        fs.unlink('tmp/image.png', (err) => {
                                            if(err) throw err;
                                        });
                                    });
                                });
                            }catch{
                                await socket.sendMessage(rJid, {text: 'Erro ao gerar imagem.'}, {quoted: m.messages[0]});
                            };
                        };

                        break;

                    case "$sing":

                        if(msg == '$sing'){
                            await socket.sendMessage(rJid, {text: 'Funcionando. Posso te ajudar em algo?'}, {quoted: m.messages[0]});
                        }else{
                            await socket.sendMessage(rJid, {text: 'Cantando música...'}, {quoted: m.messages[0]});
                            
                            try{
                                await Sing(msg, () => {
                                    xEvent.on('song_not_found', async () => {
                                        await socket.sendMessage(rJid, {text: 'Música não encontrada.'}, {quoted: m.messages[0]});
                                        return;
                                    });
    
                                    socket.sendMessage(rJid, {audio: {url: 'tmp/audio.mp3'}, mimetype: 'audio/mp4', ptt: true}, {quoted: m.messages[0]})
                                    .then(() => {
                                        fs.unlink('tmp/audio.mp3', (err: any) => {
                                            if(err) throw err;
                                        });
                                    });
                                });
                            }catch{
                                await socket.sendMessage(rJid, {text: 'Erro ao procurar música.'}, {quoted: m.messages[0]});
                            };
                        };
                };
            };
        }catch{
            console.log('Message type not suported.');
        };
    });

    // For production activate this:
    // restart()
};

const restart = () => {
    const _30minutes = 1000 * 60 * 30;

    setTimeout(() => {
        process.exit(0)
    }, _30minutes);
}