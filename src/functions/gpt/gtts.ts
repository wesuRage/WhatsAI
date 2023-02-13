import googleTTS from 'node-google-tts-api';
import { ChatGPT } from "./chatgpt";
import { join, resolve} from 'path';
import { writeFileSync } from 'fs';

export const gTTS = async (msg: string) => {
    const _text = await ChatGPT(msg);
    const Path = join(resolve(__dirname, '..', '..', 'tmp') + `/${Math.floor(Math.random() * 10000)}.mp3`)

    const tts = new googleTTS();
    await tts.get({
        text: _text,
        lang: 'pt-BR',
        limit_bypass: true,
    }).then((arr: Buffer) => {
        try{
            const ab = new Array(arr);
            let audio = tts.concat(ab);
    
            writeFileSync(Path, audio);

        }catch{
            let audio = tts.concat(arr);
            writeFileSync(Path, audio);        
        };
    });

    return Path;
};
