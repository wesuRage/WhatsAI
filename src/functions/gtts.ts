import { ChatGPT } from "./chatgpt";
import path from 'path';
import fs from 'fs';
import googleTTS from 'node-google-tts-api';

export const gTTS = async (msg: string) => {
    const _text = await ChatGPT(msg);
    const Path = path.join(path.resolve(__dirname, '..', '..', 'tmp') + `/audio.mp3`)

    const tts = new googleTTS();
    await tts.get({
        text: _text,
        lang: 'pt-BR',
        limit_bypass: true,
    }).then((arr: Buffer) => {
        try{
            const ab = new Array(arr);
            let audio = tts.concat(ab);
    
            fs.writeFileSync(Path, audio);

        }catch{
            let audio = tts.concat(arr);
            fs.writeFileSync(Path, audio);        
        };
    });

};
