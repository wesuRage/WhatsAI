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


