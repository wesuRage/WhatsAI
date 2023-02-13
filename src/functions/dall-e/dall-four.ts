import { ImagesResponseDataInner } from 'openai';
import ffmpeg from 'fluent-ffmpeg'
import fs from 'fs'
import { xEvent } from '../../core/utils';

export const Dall_Four = (response: Array<ImagesResponseDataInner>) => {
  if (!fs.existsSync("./tmp/image")) {
    fs.mkdirSync("./tmp/image");
  };

  let n = 1;

  const id = Math.random() * 1000
  let img = {
    data: [{
      id: 5555,
      images: []
    }]
  }

  // if (!fs.existsSync('tmp/images.json')) {
  //   //create new file if not exist
  //   fs.closeSync(fs.openSync('tmp/images.json', 'w'));
  // }

  // const file = fs.readFileSync('tmp/images.json')

  response.forEach(async (images, index, arr) => {

    img.data.push({id: 5555, images: [images.b64_json]});
    const buffer = Buffer.from(images.b64_json, "base64");

    fs.writeFileSync(`./tmp/image/${n}.png`, buffer);

    // if (file.length == 0) {
    //   fs.writeFileSync("tmp/images.json", JSON.stringify([img]))
    // } else {
    //     const json = JSON.parse(file.toString())

        
    //     fs.writeFileSync("tmp/images.json", JSON.stringify(img))
    // };

    if (index === arr.length - 1) {
      setTimeout(async () => {
        ffmpeg()
          .addOutputOptions(['-i', './tmp/image/%0d.png'])
          .complexFilter(["tile=2x2"])
          .save('./tmp/four.png')
          .on('end', () => {
            fs.rmSync("tmp/image", { recursive: true, force: true })

            xEvent.emit("dall_e_gen4")
            
          })
      }, 3000);
      
    };
    n++;
  });

  return img
};

