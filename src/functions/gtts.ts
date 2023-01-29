import { ChatGPT } from "./chatgpt";
import path from 'path';
const gTTs = require('gtts');

export const gTTS = async (msg: string) => {
    const texto = await ChatGPT(msg);
    var gtts = new gTTs(texto, 'pt-br');

    const Path = path.join(path.resolve(__dirname, '..', '..', 'cache/') + `/audio.mp3`)

    await gtts.save(Path,  (err, result) => {
        if(err) { throw new Error(err) }
    });

    return `cache/audio.mp3`;
};
