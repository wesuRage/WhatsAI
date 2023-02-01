export const xEvent = {
    event: {},

    on(event: string, cb: Function){
        xEvent.event[event] = [];
        xEvent.event[event].push(cb);
    },

    emit(event: string, ...rest){
        if (event in xEvent.event === false){
            return;
        };

        xEvent.event[event].forEach((f: Function) => {
            f(...rest);
        });
    }
};