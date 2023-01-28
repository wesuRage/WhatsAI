import { ChatGPT } from "./chatgpt";
import path from 'path';
const gTTs = require('gtts');

export const gTTS = async (msg: string) => {
    const texto = await ChatGPT(msg);
    var gtts = new gTTs(texto, 'pt-br');

    const name = (Math.random() + 1).toString(36).substring(7).replace('.', '');

    // const Path = path.join(path.resolve(__dirname, '..', '..', 'cache/') + `/${name}.mp3`)
    const Path = path.join(path.resolve(__dirname, '..', '..', 'cache/') + `/audio.mp3`)

    await gtts.save(Path,  (err, result) => {
        if(err) { throw new Error(err) }
    });

    // return `${name}.mp3`;
    return `cache/audio.mp3`;
};
