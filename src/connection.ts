import makeWASocket, {
  DisconnectReason,
  useMultiFileAuthState,
} from "@adiwajshing/baileys";
import { Boom } from "@hapi/boom";
import path from "path";

export const connect = async () => {
  const { state, saveCreds } = await useMultiFileAuthState(
    path.resolve(__dirname, "..", "auth")
  );

  const socket = makeWASocket({
    printQRInTerminal: true,
    auth: state,
  });

  // https://github.com/adiwajshing/Baileys#connecting
  socket.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === "close") {
      const shouldReconnect =
        (lastDisconnect.error as Boom)?.output?.statusCode !==
        DisconnectReason.loggedOut;
      console.log(
        "connection closed due to ",
        lastDisconnect.error,
        ", reconnecting ",
        shouldReconnect
      );

      if (shouldReconnect) {
        connect();
      }
    } else if (connection === "open") {
      console.log("opened connection");
    }
  });

  socket.ev.on("creds.update", saveCreds);

  return socket;
};
