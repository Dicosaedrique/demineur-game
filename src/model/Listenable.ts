type MyEvent = {
    type: string;
    target?: any;
    data: Obj;
};

export type ListennerCallback = (event: any) => void;

export type ListennerSupressor = () => void;

interface Listenners {
    [eventName: string]: ListennerCallback[];
}

export default class Listenable {
    private listeners: Listenners;

    constructor() {
        this.listeners = {};
    }

    addEventListener = (
        evt: string,
        listener: ListennerCallback
    ): ListennerSupressor => {
        if (typeof evt === "string" && typeof listener === "function") {
            if (!(evt in this.listeners)) this.listeners[evt] = [];

            this.listeners[evt].push(listener);

            return (): void => {
                this.removeEventListener(evt, listener);
            };
        }
    };

    on = this.addEventListener; // alias

    removeEventListener = (evt: string, listener: ListennerCallback): void => {
        if (typeof evt === "string" && evt in this.listeners) {
            const indexOf = this.listeners[evt].indexOf(listener);

            if (indexOf !== -1) {
                this.listeners[evt].splice(indexOf, 1);
            }
        }
    };

    clearListeners = (evt: string): void => {
        if (typeof evt === "string" && evt in this.listeners)
            delete this.listeners[evt];
    };

    // you can put in parameters a single event or plurial events
    emmitEvent = (...events: MyEvent[]): void => {
        for (const event of events) {
            if (event.type !== null && event.type in this.listeners) {
                event.target = this;
                for (const listener of this.listeners[event.type])
                    listener(event);
            }
        }
    };
}
