import { ImagesResponseDataInner } from 'openai';
import { xEvent } from '../../core/utils';
import ffmpeg from 'fluent-ffmpeg'
import fs from 'fs'

export const Dall_Fourf = (response: Array<ImagesResponseDataInner>) => {
  if (!fs.existsSync("./tmp/image")) {
    fs.mkdirSync("./tmp/image");
  };

  let n = 1;

  const id = String(Math.floor(Math.random() * 1000))
  let img = {
    images: []
  };


  response.forEach(async (images, index, arr) => {

    img.images.push(images.b64_json);
    const buffer = Buffer.from(images.b64_json, "base64");

    fs.writeFileSync(`./tmp/image/${n}.png`, buffer);

    if (index === arr.length - 1) {
      setTimeout(async () => {
        ffmpeg()
          .addOutputOptions(['-i', './tmp/image/%0d.png'])
          .complexFilter(["tile=2x2"])
          .save('./tmp/four.png')
          .on('end', () => {
            fs.rmSync("tmp/image", { recursive: true, force: true })

            xEvent.emit("dall_e_gen4")
          });
      }, 3000);

    };
    n++;
  });


  return id;
};

