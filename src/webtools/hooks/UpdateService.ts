import { useRef, useState} from "react";
import {Bounds, UpdateService} from "../types.ts";
import {areBoundsEqual} from "@/webtools/utils.js";


type Message = {
    cmd: string, data: unknown | TileChangedMessage
}

type TileChangedMessage = {
    tileName: string, timestamp: number
}

export const useUpdateService = (url: string | undefined): UpdateService => {
    const [tileChanged, setTileChanged] = useState<TileChangedMessage | null>(null)
    const bounds = useRef<Bounds | null>(null)
    const socket = useRef<WebSocket | null>(null)


    const initializeSocket = (url: string) => {
        if(!url) return

        if (!socket.current) {

            socket.current = new WebSocket(`${url}/tiles`);

            socket.current.onerror = () => {
                console.log("err")
            }
            socket.current.onopen = () => {

                console.log("sopen", socket.current!.readyState)

                if(bounds.current){
                    const message = JSON.stringify({cmd: "subscribe", data: {boundingBox: bounds.current}})
                    socket.current!.send(message)
                }
            }

            socket.current.onclose = () => {
                console.log("sclose");
                socket.current = null
                setTimeout(() => initializeSocket(url), 10000);
            };

            socket.current.onmessage = (event) => {
                const msg: Message = JSON.parse(event.data);
                console.log(msg)
                if (msg.cmd === "tileChanged") {
                    const tileChangedMsg = msg.data as TileChangedMessage;

                    setTileChanged(tileChangedMsg);
                } else {
                    console.log("Unrecognized message from ws: ", msg);
                }
            };
        }
    }


    const setBounds = (newBounds: Bounds) => {
        if(!url) return

        bounds.current = newBounds
        if(!socket.current || socket.current.readyState !== WebSocket.OPEN){
            console.log("early")
            initializeSocket(url)
        }else{
            if(!bounds.current || !areBoundsEqual(newBounds, bounds.current)){
                const message = JSON.stringify({cmd: "subscribe", data: {boundingBox: newBounds}})
                socket.current!.send(message)
            }
        }
    }


    return {
        tileChanged,
        setBounds
    }
}