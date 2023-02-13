export type TFile =
  | proto.Message.IImageMessage
  | proto.Message.IVideoMessage
  | proto.Message.IStickerMessage;

export type TImage = proto.Message.IImageMessage;

export type TProps = {
    content?: string;
    media?: any;
    mentions?: string[];
    type: string;
};