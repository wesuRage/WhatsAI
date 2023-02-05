import { Stab_Diff } from "./functions/stable_diffusion";
import { Stickerify } from "./functions/stickerify";
import { Dall_E } from "./functions/dall-e/dall-e";
import { ChatGPT } from "./functions/chatgpt";
import { connect } from "./core/connection";
import { gTTS } from "./functions/gtts";
import { Sing } from "./functions/sing";
import { 
    readFileSync, 
    unlink, mkdirSync, 
    existsSync} 
from 'fs';
import {
    xEvent, 
    Restart, 
    Logs } 
from "./core/utils";

export default async () => {
    const socket = await connect();

    socket.ev.on('messages.upsert', async (m) => {   
        if(!existsSync("./tmp/")){mkdirSync("./tmp/")};

        Logs(m, true)

        try{
            const msg = m.messages[0].message.conversation || m.messages[0].message.extendedTextMessage.text;
            const rJid = m.messages[0].key.remoteJid;

            if(msg){
                
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
                            const audio = await gTTS(msg)
                            await socket.sendMessage(rJid, {audio: {url: `${audio}`}, mimetype: 'audio/mp4', ptt: true}, {quoted: m.messages[0]})
                            .then(() => {
                                unlink(audio, (err: any) => {
                                    if(err) throw err;
                                });
                            });
                        };
                        break;

                    case '$stab-diff':

                        if(msg == '$stab-diff'){
                            await socket.sendMessage(rJid, {text: 'Funcionando. Posso te ajudar em algo?'}, {quoted: m.messages[0]});
                        }else{
                            await socket.sendMessage(rJid, {text: 'Gerando imagem...\nModelo: stable-diffusion\nℹ️ A geração pode levar um tempo.'}, {quoted: m.messages[0]});
                            await socket.sendMessage(rJid, {text: 'ℹ️ Tempo de geração estimado: 40-60 minutos (pc ruim pra geração de imagens).'});
                            
                            try{
                                await Stab_Diff(msg)
                                xEvent.on('image_generated', () => {
                                    console.log("fim")
                                    socket.sendMessage(rJid, {image: {url: 'tmp/image.png'}}, {quoted: m.messages[0]})
                                    .then(() => {
                                        unlink('tmp/image.png', (err) => {
                                            if(err) throw err;
                                        });
                                    });
                                });
                            }catch{
                                await socket.sendMessage(rJid, {text: 'Erro ao gerar imagem.'}, {quoted: m.messages[0]});
                            };
                        };
                        break;

                    case '$sing':
                        await socket.sendMessage(rJid, {text: 'Temporariamente indisponível'}, {quoted: m.messages[0]});
                        
                        break;
                    
                    case '$sticker':

                        if(msg == '$sticker'){
                            await socket.sendMessage(rJid, {text: 'Funcionando. Posso te ajudar em algo?'}, {quoted: m.messages[0]});
                        }else{
                            await socket.sendMessage(rJid, {text: 'Gerando figurinha...'}, {quoted: m.messages[0]});
                            const dataI = m.messages[0].message.extendedTextMessage.contextInfo.quotedMessage

                            Stickerify(msg, dataI, async () => {
                                await socket.sendMessage(rJid, {sticker: readFileSync('tmp/sticker.webp')})
                            }).then(() => {
                                unlink('tmp/sticker.webp', (err) => {
                                    if(err) throw err;
                                });
                            })

                            xEvent.on('error_to_gen', async () => {
                                await socket.sendMessage(rJid, {text: 'Erro ao gerar sticker.'}, {quoted: m.messages[0]});
                            })
                            
                            xEvent.on('wrong_output_type', async () => {
                                await socket.sendMessage(rJid, {text: 'Modo de uso: "$sticker --photo" ou "$sticker --video" marcando uma foto/video'}, {quoted: m.messages[0]});
                            })
                        };
                        break;
                    
                    case '$dall-e':
                        if(msg == '$dall-e'){
                            await socket.sendMessage(rJid, {text: 'Funcionando. Posso te ajudar em algo?'}, {quoted: m.messages[0]});
                        }else{
                            await socket.sendMessage(rJid, {text: 'Gerando imagem...'}, {quoted: m.messages[0]});
                            await socket.sendMessage(rJid, {image: {url: `${await Dall_E(msg)}`}}, {quoted: m.messages[0]});
                        }
                };
            };
        }catch{
            //nothing
        };
    });

    // For production activate this:
    // Restart()
};
