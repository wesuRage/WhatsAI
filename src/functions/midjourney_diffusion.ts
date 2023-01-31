const { spawn } = require('child_process')

export const Mid_Diff = async (prompt: string) => {
    const _prompt = prompt.replace('$mid-diff', '');

    const process = spawn('python', ['./src/python/midjourney_diffusion.py', `${_prompt}`]);

    let url: string;

    await process.stdout.on('data', (data) => {
        url = data.toString();
        if(url == '\n\n\n\n\n\n\n\nDOONEEEEE') throw new Error('Done')
    });

    await process.stderr.on('data', (err: any) => {
        console.log(err.toString())
    });

    return url;
};
