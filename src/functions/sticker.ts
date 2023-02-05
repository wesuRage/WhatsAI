import { downloadContentFromMessage, proto } from "@adiwajshing/baileys";

import ffmpeg from "fluent-ffmpeg";
import webp from "node-webpmux";

import { writeFileSync, readFileSync, unlinkSync } from "fs";

type TFile =
  | proto.Message.IImageMessage
  | proto.Message.IVideoMessage
  | proto.Message.IStickerMessage;

const insertAttr = async (path) => {
  const img = new webp.Image();

  // Depois você trocakkkk
  const json = {
    "sticker-pack-id": `https://github.com/Ahosall`,
    "sticker-pack-name": "Com 🤍",
    "sticker-pack-publisher": "Ahosall",
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
        `-vcodec`,
        `libwebp`,
        `-vf`,
        `scale='min(350,iw)':min'(350,ih)':force_original_aspect_ratio=decrease,fps=15, pad=350:350:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`,
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
        "scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse",
        "-loop",
        "0",
        "-ss",
        "00:00:00",
        "-t",
        "00:00:05",
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
  const pathVIn = `./${sticker}.mp4`;
  const pathIIn = `./${sticker}.png`;
  const pathOut = `./${sticker}.webp`;

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
