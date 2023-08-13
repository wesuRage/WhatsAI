import { DisconnectReason, useMultiFileAuthState } from "@whiskeysockets/baileys";
import makeWASocket from "@whiskeysockets/baileys/lib/Socket";
import { Boom } from "@hapi/boom";
import pino from "pino";
import path from 'path';

export const Connect = async () => {

  const { state, saveCreds } = await useMultiFileAuthState(
    path.resolve(__dirname, "..", "..", "auth")
  );

  const socket = makeWASocket({
    printQRInTerminal: true,
    auth: state,
    logger: pino({ level: 'silent' })
  });

  socket.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect } = update;

    if (connection === 'open') {
      console.log(`\nLogged on ${socket.user.name} ${socket.user.id}`)
    }

    if (connection === 'close') {
      const shouldReconnect = (lastDisconnect?.error as Boom)?.output
        ?.statusCode !== DisconnectReason.loggedOut;

      if (shouldReconnect) {
        await Connect();
      }
    }
  });

  socket.ev.on("creds.update", saveCreds);

  return socket;
};