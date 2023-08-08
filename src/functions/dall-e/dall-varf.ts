import { downloadContentFromMessage } from "@whiskeySockets/baileys";
import { createReadStream, writeFileSync } from 'fs'
import type { TImage } from "../../core/TTypes";
import { openai } from '../../core/openai';
import { xEvent } from '../../core/utils'
import ffmpeg from "fluent-ffmpeg";

export const Dall_Varf = async (image: TImage) => {

  let response: string;
  let buffer = Buffer.from([]);

  if (image.mimetype.split("/")[0] == "image") {
    const media = await downloadContentFromMessage(image, "image");

    for await (const chunk of media) {
      buffer = Buffer.concat([buffer, chunk]);
    }

    writeFileSync('./tmp/variation.png', buffer)

    await new Promise(async (resolve, reject) => {
      ffmpeg("./tmp/variation.png")
      .on("error", reject)
      .on("end", () => resolve(true))
      .addOutputOptions([
        "-vf",
        "scale=1024:1024",
      ])
      .save("./tmp/var.png");
    }).then(async () => {
      const request = await openai.createImageVariation(
        ((createReadStream("./tmp/var.png") as unknown) as File),
        1,
        "1024x1024",
      );
  
      response = request.data.data[0].url;
    })
  } else{
    xEvent.emit("wrong_type_of_data");
  };

  return response !== "" ? response : "error"
};
