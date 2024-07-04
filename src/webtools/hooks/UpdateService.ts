import { useRef, useState } from 'react';
import { type Bounds, type UpdateService } from '../types.ts';
import { areBoundsEqual, calculateTileBounds } from '@/webtools/utils.js';

type Message = {
    cmd: string;
    data: unknown | TileChangedMessage;
};

type TileChangedMessage = {
    tileName: string;
    timestamp: number;
};

export const useUpdateService = (url: string | undefined): UpdateService => {
    const [tileChanged, setTileChanged] = useState<TileChangedMessage | null>(null);
    const bounds = useRef<Bounds | null>(null);
    const socket = useRef<WebSocket | null>(null);

    const initializeSocket = (url: string) => {
        if (!url) return;

        if (!socket.current) {
            socket.current = new WebSocket(`${url}/tiles`);

            socket.current.onerror = () => {
                console.log('err');
            };
            socket.current.onopen = () => {
                console.log('sopen', socket.current!.readyState);

                if (bounds.current) {
                    const message = JSON.stringify({
                        cmd: 'subscribe',
                        data: { boundingBox: bounds.current },
                    });
                    socket.current!.send(message);
                }
            };

            socket.current.onclose = () => {
                console.log('sclose');
                socket.current = null;
                setTimeout(() => initializeSocket(url), 10000);
            };

            socket.current.onmessage = (event) => {
                const msg: Message = JSON.parse(event.data);

                if (msg.cmd === 'tileChanged') {
                    const tileChangedMsg = msg.data as TileChangedMessage;

                    setTileChanged(tileChangedMsg);
                } else {
                    console.log('Unrecognized message from ws: ', msg);
                }
            };
        }
    };

    const setBounds = (newBounds: Bounds) => {
        if (!url) return;

        if (!socket.current || socket.current.readyState !== WebSocket.OPEN) {
            initializeSocket(url);
        } else {
            // Expand the newBounds to include the whole tile (top-right coord) because
            // that is what triggers the update right now.
            newBounds = calculateTileBounds(newBounds);

            if (!bounds.current || !areBoundsEqual(newBounds, bounds.current)) {
                const message = JSON.stringify({
                    cmd: 'subscribe',
                    data: { boundingBox: newBounds },
                });
                socket.current!.send(message);
            }
        }

        bounds.current = newBounds;
    };

    return {
        tileChanged,
        setBounds,
    };
};
