import { spawn } from 'child_process';
import { xEvent } from '../core/utils';

export const Stab_Diff = async (prompt: string) => {
    const _prompt = prompt.replace('$stab-diff', '');

    const process = spawn('python', ['./src/functions/python/stable_diffusion.py', `${_prompt}`]);

    process.stderr.on('data', (err: Error) => {
        console.log(err.toString())
    });

    process.once('exit', () => {
        xEvent.emit("image_generated")
    });
};
