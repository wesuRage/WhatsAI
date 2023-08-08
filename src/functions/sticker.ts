import { downloadContentFromMessage } from "@whiskeySockets/baileys";
import { writeFileSync, readFileSync, unlinkSync } from "fs";
import type { TFile } from "../core/TTypes";
import ffmpeg from "fluent-ffmpeg";
import webp from "node-webpmux";

const insertAttr = async (path) => {
  const img = new webp.Image();

  const json = {
    "sticker-pack-id": `https://github.com/wesuRage`,
    "sticker-pack-name": "WhatsAI",
    "sticker-pack-publisher": "wesuRage",
    emojis: ["happy"],
  };

  const exifAttr = Buffer.from([
    0x49, 0x49, 0x2a, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57,
    0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00,
  ]);

  const jsonBuff = Buffer.from(JSON.stringify(json), "utf-8");

  const exif = Buffer.concat([exifAttr, jsonBuff]);

  exif.writeUIntLE(jsonBuff.length, 14, 4);
  await img.load(path);

  img.exif = exif;

  await img.save(path);
};

const convertImage = async (imgIn: string, imgOut: string) => {
  return await new Promise(async (resolve, reject) => {
    await ffmpeg(imgIn)
      .on("error", reject)
      .on("end", () => resolve(true))
      .addOutputOptions([
        "-vcodec",
        "libwebp",
        "-vf",
        "scale=512:512",
      ])
      .toFormat("webp")
      .save(imgOut);
  }).then(async () => {
    await insertAttr(imgOut);
    const buff = readFileSync(imgOut);

    unlinkSync(imgIn);
    unlinkSync(imgOut);

    return buff;
  });
};

const convertVideo = async (videoIn: string, videoOut: string) => {
  return await new Promise(async (resolve, reject) => {
    ffmpeg(videoIn)
      .inputFormat("mp4")
      .on("error", reject)
      .on("end", () => resolve(true))
      .addOutputOptions([
        "-vcodec",
        "libwebp",
        "-vf",
        "scale=512:512,fps=15",
        "-loop",
        "0",
        "-ss",
        "00:00:00",
        "-preset",
        "default",
        "-an",
        "-vsync",
        "0",
      ])
      .toFormat("webp")
      .save(videoOut);
  }).then(async () => {
    await insertAttr(videoOut);
    const buff = readFileSync(videoOut);

    unlinkSync(videoIn);
    unlinkSync(videoOut);

    return buff;
  });
};

export const Sticker = async (file: TFile) => {
  var buffer = Buffer.from([]);

  const sticker = String(Math.floor(Math.random() * 10000));
  const pathVIn = `./tmp/${sticker}.mp4`;
  const pathIIn = `./tmp/${sticker}.png`;
  const pathOut = `./tmp/${sticker}.webp`;

  if (file.mimetype.split("/")[0] == "image") {
    const media = await downloadContentFromMessage(file, "image");

    for await (const chunk of media) {
      buffer = Buffer.concat([buffer, chunk]);
    }
    writeFileSync(pathIIn, buffer);
    return await convertImage(pathIIn, pathOut);
  } else if (file.mimetype.split("/")[0] == "video") {
    const media = await downloadContentFromMessage(file, "video");

    for await (const chunk of media) {
      buffer = Buffer.concat([buffer, chunk]);
    }

    writeFileSync(pathVIn, buffer);
    return await convertVideo(pathVIn, pathOut);
  }
};
