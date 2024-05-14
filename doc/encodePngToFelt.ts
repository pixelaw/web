import {PNG} from 'pngjs';
import fs from 'fs';
import {Buffer} from 'buffer';
import {Account, CallData, Contract, Provider, RpcProvider} from "starknet";

async function processImage(imageFile: string, position: {x: number, y: number}) {
    const png = PNG.sync.read(fs.readFileSync(imageFile));
    const pixels = Array.from(png.data);

    // Get image width and height from png
    const image_width = png.width;
    const image_height = png.height;

    let strippedPixels: number[][] = [];
    for (let i = 0; i < pixels.length; i += 4) {
        let chunk = pixels.slice(i, i + 4);
        strippedPixels.push(chunk);
    }

    let pixelChunks: number[][] = [];
    for (let i = 0; i < strippedPixels.length; i += 7) {
        let chunk = strippedPixels.slice(i, i + 7).flat();
        pixelChunks.push(chunk);
    }

    let image_data: string[] = pixelChunks.map(chunk => {
        let buffer = Buffer.from(chunk);
        let hexString = buffer.toString('hex');
        return "0x0000000".concat(hexString).padEnd(65, '0');
    });

    const provider = new RpcProvider({nodeUrl: "http://127.0.0.1:5050",})

    const account0 = new Account(
        provider,
        "0x003c4dd268780ef738920c801edc3a75b6337bc17558c74795b530c0ff502486",
        "0x2bbf4f9fd0bbb2e60b0316c1fe0b76cf7a4d0198bd493ced9b8df2a3a24d68a");

    const testAddress = "0x1f04b61e71f2afa9610c422db007807f73ebad6b4c069e72bb6e22ff032a93c"
    const { abi: testAbi } = await provider.getClassAt(testAddress);
    if (testAbi === undefined) {
        throw new Error('no abi.');
    }
    const myTestContract = new Contract(testAbi, testAddress, provider);
    myTestContract.connect(account0);
    const defaultParams = {
        for_player: 0,
        for_system: 0,
        position,
        color: "0xAFAFAF"
    }

    const result = await account0.execute({
        contractAddress: testAddress,
        entrypoint: 'image',
        calldata: CallData.compile({defaultParams,image_width,image_height,image_data}),
    });
    await provider.waitForTransaction(result.transaction_hash);

    console.log({result});
}

// Usage
processImage('doc/small.png', {x: 60, y: 0});
