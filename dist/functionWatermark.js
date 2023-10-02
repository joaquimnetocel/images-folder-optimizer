import sharp from 'sharp';
import { functionHandleBars } from './functionHandleBars.js';
export const functionWatermark = async function ({ parSharp, parWatermarkOptions }) {
    if (parWatermarkOptions === undefined) {
        return;
    }
    if (parWatermarkOptions.numberOpacity > 1) {
        return;
    }
    if (parWatermarkOptions.numberOpacity < 0) {
        return;
    }
    const { width: numberImageWidth, height: numberImageHeight } = await parSharp.metadata();
    if (numberImageWidth === undefined) {
        return;
    }
    if (numberImageHeight === undefined) {
        return;
    }
    parWatermarkOptions.stringWatermarkFile = functionHandleBars(parWatermarkOptions.stringWatermarkFile);
    const sharpWatermark = sharp(parWatermarkOptions.stringWatermarkFile);
    const functionProccessWatermarkResizeOptions = async function () {
        const temp = parWatermarkOptions.objectResizeOptions ?? {
            width: numberImageWidth,
            height: numberImageHeight,
        };
        const objectReturn = { ...temp };
        // IF PERCENTUAL WIDTH THEN MAKE WATERMARK WIDTH AS PERCENTUAL OF IMAGE WIDTH
        if (objectReturn.width !== undefined) {
            if (objectReturn.width < 1) {
                objectReturn.width = Math.floor(objectReturn.width * numberImageWidth);
            }
        }
        /////
        // TRUNCATE WATERMARK WIDTH TO IMAGE WIDTH
        if (objectReturn.width !== undefined) {
            objectReturn.width = objectReturn.width > numberImageWidth ? numberImageWidth : objectReturn.width;
        }
        /////
        // TRUNCATE WATERMARK HEIGHT TO IMAGE HEIGHT
        if (objectReturn.height !== undefined) {
            objectReturn.height = objectReturn.height > numberImageHeight ? numberImageHeight : objectReturn.height;
        }
        /////
        return objectReturn;
    };
    const objectNewWatermarkResizeOptions = await functionProccessWatermarkResizeOptions();
    sharpWatermark.resize(objectNewWatermarkResizeOptions);
    sharpWatermark.composite([
        {
            input: Buffer.from([0, 0, 0, 255 * parWatermarkOptions.numberOpacity]),
            raw: {
                width: 1,
                height: 1,
                channels: 4,
            },
            tile: true,
            blend: 'dest-in',
        },
    ]);
    const bufferWatermark = await sharpWatermark.toBuffer();
    parSharp.composite([{ input: bufferWatermark, gravity: parWatermarkOptions.stringGravity }]);
};
