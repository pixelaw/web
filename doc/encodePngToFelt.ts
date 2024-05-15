import {PNG} from 'pngjs';
import fs from 'fs';
import {Buffer} from 'buffer';
import {Account, CallData, Contract, Provider, RpcProvider} from "starknet";

async function processImage(imageFile: string, origin: { x: number, y: number }, write: boolean) {
    const png = PNG.sync.read(fs.readFileSync(imageFile));

    const pixels = [];
    for (let i = 0; i < png.data.length; i += 4) {
        pixels.push(Array.from(png.data.slice(i, i + 4)));
    }

    const BUFFER_SIZE = 1000
    let buffer = []
    const PIXELS_PER_FELT = 7
    let x_offset = 0
    for (let last_pixel = 0; last_pixel < pixels.length; last_pixel++) {
        let x = last_pixel % (png.width );
        let y = Math.floor(last_pixel / png.width);

        buffer.push(pixels[last_pixel])

        // If the buffer is full or we reached the end of the row
        if (
            buffer.length === BUFFER_SIZE
            || x == png.width - 1
            || last_pixel === pixels.length -1
        ) {

            // Chop in rows of 7
            let feltPixels: number[][] = [];
            for (let i = 0; i < buffer.length; i += PIXELS_PER_FELT) {
                let chunk = buffer.slice(i, i + PIXELS_PER_FELT).flat();
                feltPixels.push(chunk);
            }

            let image_data: string[] = feltPixels.map(pixel => {
                let buf = Buffer.from(pixel);
                let hexString = buf.toString('hex');
                return "0x0000000".concat(hexString).padEnd(65, '0');
            });

            buffer = []
            if (write) await submit({x: origin.x + x_offset, y: origin.y + y}, image_data)

            // Adjust the offset if we didnt finish the row (so the row is wider than 1000 pixels
            if(x == png.width - 1){
                x_offset = 0
            }else{
                x_offset = x
            }

        }
    }
}


async function submit(position: { x: number; y: number; }, image_data: string[]) {

    const provider = new RpcProvider({nodeUrl: "http://127.0.0.1:5050",})

    const account0 = new Account(
        provider,
        "0x003c4dd268780ef738920c801edc3a75b6337bc17558c74795b530c0ff502486",
        "0x2bbf4f9fd0bbb2e60b0316c1fe0b76cf7a4d0198bd493ced9b8df2a3a24d68a");

    const contractAddress = "0x1f04b61e71f2afa9610c422db007807f73ebad6b4c069e72bb6e22ff032a93c"
    const {abi} = await provider.getClassAt(contractAddress);
    if (abi === undefined) {
        throw new Error('no abi.');
    }
    const myTestContract = new Contract(abi, contractAddress, provider);
    myTestContract.connect(account0);
    console.log({position})
    const defaultParams = {
        for_player: 0,
        for_system: 0,
        position,
        color: "0xAFAFAF"
    }
    try {
        const entrypoint = 'pixel_row'
        const calldata = CallData.compile({
            defaultParams,
            image_data
        })

        const {suggestedMaxFee: estimatedFee1} = await account0.estimateInvokeFee({
            contractAddress,
            entrypoint,
            calldata,
        });

        const result = await account0.execute({
            contractAddress,
            entrypoint,
            calldata,
        });
        await provider.waitForTransaction(result.transaction_hash);

        console.log({result});

    } catch (e) {
        console.error(e)
    }

}

// Usage
processImage('doc/coast.png', {x: 0, y: 0}, true);
