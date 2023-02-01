require('dotenv').config();
import { xEvent } from '../core/xevents';
import XMLHttpRequest from 'xhr2';
import googleTTS from 'node-google-tts-api';
import path from 'path';
import fs from 'fs';

export const Sing = async (query: string, cb: Function) => {

    const key = process.env.VAGALUME_API_KEY

    const _query = query.replace('$sing', '').split('/')
    const _art = encodeURI(_query[0]);
    const _mus = encodeURI(_query[1]);

    const Path = path.join(path.resolve(__dirname, '..', '..', 'tmp') + `/audio.mp3`)
    const tts = new googleTTS();
    
    const url = "http://api.vagalume.com.br/search.php"
        +"?art="+_art
        +"&mus="+_mus
        +"&apikey="+key;
    
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = async () => {

        try {
            const lyrics: string = xhr.response.mus[0].text;

            await tts.get({
                text: lyrics.replace('\n', '.'),
                lang: 'pt-BR',
                limit_bypass: true,
            }).then((arr: Buffer) => {
                try{
                    const ab = new Array(arr);
                    let audio = tts.concat(ab);
            
                    fs.writeFileSync(Path, audio);
                    cb();
                }catch{
                    let audio = tts.concat(arr);
                    fs.writeFileSync(Path, audio);
                    cb();
                };
            });
        }catch{
            xEvent.emit('song_not_found');
        }
    };
    xhr.send();
};
