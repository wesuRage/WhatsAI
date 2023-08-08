import { proto } from "@whiskeySockets/baileys";

export const Dall_Getf = (id: String): proto.Message.ListMessage.ISection[] => {

  try {

    const options =
      [
        {
          title: "Upscale",
          rows: [
            { title: "U1", rowId: "u1" },
            { title: "U2", rowId: "u2" },
            { title: "U3", rowId: "u3" },
            { title: "U4", rowId: "u4" }
          ]
        },
        {
          title: "Variation",
          rows: [
            { title: "V1", rowId: "v1" },
            { title: "V2", rowId: "v2" },
            { title: "V3", rowId: "v3" },
            { title: "V4", rowId: "v4" }
          ]
        },
      ]


    return options as proto.Message.ListMessage.ISection[];
  } catch (error) {
    console.log(error)
  }
};

Dall_Getf("oi")