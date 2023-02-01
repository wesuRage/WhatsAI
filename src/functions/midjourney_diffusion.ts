import { spawn } from 'child_process';
import { xEvent } from '../core/xevents';

export const Mid_Diff = async (prompt: string) => {
    const _prompt = prompt.replace('$mid-diff', '');

    const process = spawn('python', ['./src/python/midjourney_diffusion.py', `${_prompt}`]);

    process.stderr.on('data', (err: any) => {
        console.log(err.toString())
    });

    process.once('exit', () => {
        xEvent.emit("image_generated")
    });
};
