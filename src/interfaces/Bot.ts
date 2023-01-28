import { proto } from "@adiwajshing/baileys";
import { Menu } from "./Menu";

export interface Bot {
  remoteJid?: string | undefined | null;
  socket: any;
  botInfo: { id: string; name: string };
  isOwner: (id: string) => Promise<boolean>;
  sendText: (text: string) => Promise<proto.IWebMessageInfo>;
  reply: (text: string) => Promise<proto.IWebMessageInfo>;
  sendMenu: (object: Menu) => Promise<proto.WebMessageInfo>;
  sendImage: (
    pathOrBuffer: string | Buffer,
    caption?: string,
    isReply?: boolean
  ) => Promise<proto.WebMessageInfo>;
  isImage: boolean;
  webMessage: proto.IWebMessageInfo;
}
