import type { TProps } from "./TTypes";
import { proto } from "@whiskeysockets/baileys";

export const NormalizeContent = (msg: proto.IMessage) => {
  let props: TProps = { type: Object.keys(msg)[0] };

  if (props.type == "conversation") {
    props["content"] = msg.conversation;
  } else if (props.type == "extendedTextMessage") {
    let ctxInf = msg.extendedTextMessage.contextInfo;

    if (ctxInf) {
      let quotedMsg = ctxInf.quotedMessage;
      props["mentions"] = ctxInf.mentionedJid ? ctxInf.mentionedJid : [];
      if (quotedMsg) {
        props["quoted"] = quotedMsg;

        let quotedType = Object.keys(quotedMsg)[0];
        if (
          quotedType == "imageMessage" ||
          quotedType == "videoMessage" ||
          quotedType == "stickerMessage"
        )
          props["media"] = quotedMsg[quotedType];
      }
    }

    props["content"] = msg.extendedTextMessage.text;
  } else if (props.type == "imageMessage") {
    props["media"] = msg.imageMessage;

    props["content"] = msg.imageMessage.caption;
  } else if (props.type == "videoMessage") {
    props["media"] = msg.videoMessage;

    props["content"] = msg.videoMessage.caption;
  }
  return props;
};


export const Logs = (m: object, on: boolean) => {
  if (on) {
    console.log(JSON.stringify(m, undefined, 2));
  }
};

export const xEvent = {
  event: {},

  on(event: string, cb: Function) {
    xEvent.event[event] = [];
    xEvent.event[event].push(cb);
  },

  emit(event: string) {
    if (event in xEvent.event === false) {
      return;
    }

    xEvent.event[event].forEach((f: Function) => {
      f();
    });
  },
};