import { openai } from '../../core/openai';
import { xEvent } from '../../core/utils';
import { Dall_Four } from './dall-four';
import { writeFileSync } from "fs"

const fourImages = async (prompt: string,) => {
    const request = await openai.createImage({
        prompt: prompt,
        n: 4,
        size: '512x512',
        response_format: 'b64_json',
    });

    const response = request.data.data;
    return Dall_Four(response);

};

export const Dall_E = async (prompt: string) => {

    const _prompt = prompt.replace('$dall-e', '').replace('--four', '');

    if (prompt.includes('--four')) {
        return fourImages(_prompt);
    } else {
        const request = await openai.createImage({
            prompt: _prompt,
            n: 1,
            size: '512x512',
            response_format: 'b64_json',
        });

        const buffer = request.data.data[0].b64_json;

        const img = Buffer.from(buffer, 'base64')
        
        writeFileSync("./tmp/single.png", img);

        setTimeout(() => {
            xEvent.emit("dall_e_gen");
        }, 3000);
    };
};
