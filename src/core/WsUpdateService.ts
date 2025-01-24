import { areBoundsEqual, calculateTileBounds } from "@/webtools/utils.js";
import { type Bounds, TILESIZE, type UpdateService } from "@/webtools/types/types.ts";

type Message = {
    cmd: string;
    data: unknown | TileChangedMessage;
};

type TileChangedMessage = {
    tileName: string;
    timestamp: number;
};

export class WsUpdateService implements UpdateService {
    private tileChanged: TileChangedMessage | null = null;
    private bounds: Bounds | null = null;
    private socket: WebSocket | null = null;
    private url: string | undefined;

    constructor(url: string | undefined) {
        this.url = url;
        if (url) {
            this.initializeSocket(url);
        }
    }

    private initializeSocket(url: string): void {
        if (!this.socket) {
            this.socket = new WebSocket(`${url}/tiles`);

            this.socket.onerror = () => {
                console.log("err");
            };

            this.socket.onopen = () => {
                console.log("sopen", this.socket?.readyState);

                if (this.bounds) {
                    const message = JSON.stringify({ cmd: "subscribe", data: { boundingBox: this.bounds } });
                    this.socket?.send(message);
                }
            };

            this.socket.onclose = () => {
                console.log("sclose");
                this.socket = null;
                setTimeout(() => this.initializeSocket(url), 10000);
            };

            this.socket.onmessage = (event) => {
                const msg: Message = JSON.parse(event.data);

                if (msg.cmd === "tileChanged") {
                    const tileChangedMsg = msg.data as TileChangedMessage;
                    this.tileChanged = tileChangedMsg;
                } else {
                    console.log("Unrecognized message from ws: ", msg);
                }
            };
        }
    }

    public setBounds(b: Bounds): void {
        let newBounds = b;
        if (!this.url) return;

        if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
            this.initializeSocket(this.url);
        } else {
            newBounds = calculateTileBounds(newBounds);

            if (!this.bounds || !areBoundsEqual(newBounds, this.bounds)) {
                const message = JSON.stringify({ cmd: "subscribe", data: { boundingBox: newBounds } });
                this.socket?.send(message);
            }
        }

        this.bounds = newBounds;
    }

    public getTileChanged(): TileChangedMessage | null {
        return this.tileChanged;
    }
}

