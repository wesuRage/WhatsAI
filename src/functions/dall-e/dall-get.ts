import { proto } from "@adiwajshing/baileys";
import { xEvent } from "../../core/utils";
import fs from "fs"

export const Dall_Get = (imagens: number): proto.Message.ListMessage.ISection[] => {

  const json_file = JSON.parse(fs.readFileSync("tmp/images.json").toString())
  const img = imagens;
  json_file;
  console.log(json_file, 1)

  const i1 = imagens[0];
  const i2 = imagens[1];
  const i3 = imagens[2];
  const i4 = imagens[3];

  const options = 
    [
      {
        title: "Upscale",
        rows: [
          { title: "U1", rowId: "u1" + i1 },
          { title: "U2", rowId: "u2" + i2 },
          { title: "U3", rowId: "u3" + i3 },
          { title: "U4", rowId: "u4" + i4 }
        ]
      },
      {
        title: "Variation",
        rows: [
          { title: "V1", rowId: "v1" + i1 },
          { title: "V2", rowId: "v2" + i2 },
          { title: "V3", rowId: "v3" + i3 },
          { title: "V4", rowId: "v4" + i4 }
        ]
      },
    ]
  

    return options as proto.Message.ListMessage.ISection[] ;
};