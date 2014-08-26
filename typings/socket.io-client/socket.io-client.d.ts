declare module socket.io.client {

    /**
     * Options:
     * - reconnection whether to reconnect automatically (true)
     * - reconnectionDelay how long to wait before attempting a new reconnection (1000)
     * - reconnectionDelayMax maximum amount of time to wait between reconnections (5000).
     *   Each attempt increases the reconnection by the amount specified by reconnectionDelay.
     * - timeout connection timeout before a connect_error and connect_timeout events are emitted (20000)
     */
    interface Options {
        reconnection?: boolean;
        reconnectionDelay?:number;
        reconnectionDelayMax?:number;
        timeout?:number;
    }

    interface SocketStatic {
        (): Socket;
        (url?:string, opts?:Options): Socket;
        Socket(): Socket;
        Manager: Manager;

        /**
         * Protocol version.
         *
         */
        protocol:string;

    }

    interface Socket {
        /**
         * `Socket` constructor.
         *
         */
        (io:any, nsp:number):Socket;

        /**
         * Sends a `message` event.
         *
         * @return {Socket} self
         */
        send():Socket;

        /**
         * Override `emit`.
         * If the event is in `events`, it's emitted normally.
         *
         * @param {String} event name
         * @return {Socket} self
         */
        emit(event:string):Socket;

        /**
         * Disconnects the socket manually.
         *
         * @return {Socket} self
         */
        close():Socket;
        disconnect():Socket;
    }

    interface Manager {
        /**
         * `Manager` constructor.
         *
         * @param {String} engine instance or engine uri/opts
         * @param {Object} options
         */
        (uri?:string, opts?:Options):Manager;

        /**
         * Sets the `reconnection` config.
         *
         * @param {Boolean} true/false if it should automatically reconnect
         * @return {Manager} self
         */
        reconnection(value:Boolean):Manager;

        /**
         * Gets the `reconnection` config.
         *
         * @return {Boolean} value
         */
        reconnection():boolean;

        /**
         * Sets the reconnection attempts config.
         *
         * @param {Number} max reconnection attempts before giving up
         * @return {Manager} self
         */
        reconnectionAttempts(value:number):Manager;

        /**
         * Gets the reconnection attempts config.
         *
         * @param {Number} max reconnection attempts before giving up
         * @return {Number} value
         */
        reconnectionAttempts():number;


        /**
         * Sets the delay between reconnections.
         *
         * @param {Number} delay
         * @return {Manager} self
         */
        reconnectionDelay(value:number):Manager;

        /**
         * Gets the delay between reconnections.
         *
         * @return {Number} value
         */
        reconnectionDelay():number;

        /**
         * Sets the maximum delay between reconnections.
         *
         * @param {Number} delay
         * @return {Manager} self
         */
        reconnectionDelayMax(value:number):Manager;

        /**
         * Gets the maximum delay between reconnections.
         *
         * @return {Number} value
         */
        reconnectionDelayMax():number;

        /**
         * Sets the connection timeout. `false` to disable
         *
         * @param {Number | Boolean} delay
         * @return {Manager} self
         */
        timeout(value:number): Manager;
        timeout(value:boolean): Manager;

        /**
         * Gets the connection timeout.
         *
         * @return {Number | Boolean} value `false` for disabled
         */
        timeout<T extends number>(): T;
        timeout<T extends boolean>(): T;

        /**
         * Sets the current transport `socket`.
         *
         * @param {Function} optional, callback
         * @return {Manager} self
         */
        connect(callback?:Function):Manager;
        open(callback?:Function):Manager;

        /**
         * Creates a new socket for the given `nsp`.
         *
         * @return {Socket}
         */
        socket(nsp:number):Socket;
    }
}

declare module "socket.io-client" {

    var io:socket.io.client.SocketStatic;

export = io;

}

declare var io:socket.io.client.SocketStatic;