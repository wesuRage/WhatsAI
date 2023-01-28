import { useMultiFileAuthState } from "@adiwajshing/baileys"
import makeWASocket from "@adiwajshing/baileys/lib/Socket";
import { DisconnectReason } from "@adiwajshing/baileys/lib/Types";
import { Boom } from "@hapi/boom";
import path from 'path';

export const connect = async () => {
    const {state, saveCreds} = await useMultiFileAuthState(
        path.resolve(__dirname, '..', '..', 'auth')
    );

    const socket = makeWASocket({
        printQRInTerminal: true,
        auth: state,
    });

    socket.ev.on('connection.update',async (update) => {
        const {connection, lastDisconnect} = update;

        if (connection === 'close'){
            const shouldReconnect = (lastDisconnect?.error as Boom)?.output
                ?.statusCode !== DisconnectReason.loggedOut;

            if (shouldReconnect){
                await connect();
            };
        };
    });

    socket.ev.on('creds.update', saveCreds);

    return socket;
};