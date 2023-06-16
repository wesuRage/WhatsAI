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

export const Restart = () => {
  const _30minutes = 1000 * 60 * 30;

  setTimeout(() => {
    process.exit(0);
  }, _30minutes);
};

export const Logs = (m: object, on: boolean) => {
  if (on) {
    console.log(JSON.stringify(m, undefined, 2));
  }
};

export const IsAdmin = async (socket: any, group: string, id: string) => {
  const metadata = await socket.groupMetadata(group);
  const { participants } = metadata;
  let admins = participants.filter((element: any) => element.admin !== null);

  return admins.find((element: any) => element.id == id) ? true : false;
};
