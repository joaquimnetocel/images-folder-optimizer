// npm install -D @types/node
// npm install -D sharp
import fs from 'fs';
import sharp from 'sharp';
import { functionExtractNameAndExtension } from './functionExtractNameAndExtension.js';
import { functionHandleBars } from './functionHandleBars.js';
import { functionResize } from './functionResize.js';
import { functionWatermark } from './functionWatermark.js';
export const functionOptimizeImages = async function ({ stringOriginFolder, stringDestinationFolder, arrayInputFormats = ['avif', 'gif', 'jpg', 'png', 'svg', 'tiff', 'webp'], arrayOutputFormats, objectWebpOptions, objectAvifOptions, objectTiffOptions, objectJpegOptions, objectPngOptions, objectGifOptions, objectResizeOptions, objectBlurOptions, objectWatermarkOptions }) {
    stringOriginFolder = functionHandleBars(stringOriginFolder);
    stringDestinationFolder = functionHandleBars(stringDestinationFolder);
    const arrayTableResults = [];
    if (!fs.existsSync(stringDestinationFolder)) {
        fs.mkdirSync(stringDestinationFolder);
    }
    const arrayFileNames = fs.readdirSync(stringOriginFolder);
    console.log(`OPTIMIZING THE FOLLOWING FILES: ${arrayFileNames.join(', ')}`);
    const arrayFilePromises = arrayFileNames.map(async (currentFullFileName) => {
        const { stringFileName, stringFileExtension } = functionExtractNameAndExtension(currentFullFileName);
        if (stringFileExtension === undefined) {
            return;
        }
        if (!arrayInputFormats.includes(stringFileExtension)) {
            return;
        }
        const sharpOriginalFile = sharp(`${stringOriginFolder}/${currentFullFileName}`);
        const numberFileSize = Math.ceil(fs.statSync(`${stringOriginFolder}/${currentFullFileName}`).size / 1024);
        await functionResize({
            parSharp: sharpOriginalFile,
            parResizeOptions: objectResizeOptions,
        });
        let sharpFile = sharp(await sharpOriginalFile.toBuffer());
        if (objectBlurOptions !== undefined) {
            sharpFile.blur(objectBlurOptions.sigma);
        }
        await functionWatermark({
            parSharp: sharpFile,
            parWatermarkOptions: objectWatermarkOptions,
        });
        sharpFile = sharp(await sharpFile.toBuffer());
        const objectOptimizations = {};
        if (arrayOutputFormats.includes('webp')) {
            objectOptimizations.webp = sharpFile.clone().webp(objectWebpOptions);
        }
        if (arrayOutputFormats.includes('avif')) {
            objectOptimizations.avif = sharpFile.clone().avif(objectAvifOptions);
        }
        if (arrayOutputFormats.includes('jpg')) {
            if (stringFileExtension === 'jpg') {
                objectOptimizations.jpg = sharpFile.clone().jpeg(objectJpegOptions);
            }
        }
        if (arrayOutputFormats.includes('png')) {
            if (stringFileExtension === 'png') {
                objectOptimizations.png = sharpFile.clone().png(objectPngOptions);
            }
        }
        if (arrayOutputFormats.includes('tiff')) {
            objectOptimizations.tiff = sharpFile.clone().tiff(objectTiffOptions);
        }
        if (arrayOutputFormats.includes('gif')) {
            objectOptimizations.gif = sharpFile.clone().gif(objectGifOptions);
        }
        const arrayEntries = Object.entries(objectOptimizations);
        const arrayFormatPromises = arrayEntries.map(async ([currentKey, currentValue]) => {
            if (!fs.existsSync(`${stringDestinationFolder}/${currentKey}`)) {
                fs.mkdirSync(`${stringDestinationFolder}/${currentKey}`);
            }
            const objectReturn = await currentValue.toFile(`${stringDestinationFolder}/${currentKey}/${stringFileName}.${currentKey}`);
            const numberNewFileSize = Math.ceil(objectReturn.size / 1024);
            const numberChangeInQuiloBytes = ((numberNewFileSize - numberFileSize) / numberFileSize) * 100;
            arrayTableResults.push({
                'ORIGINAL FILE': `${currentFullFileName} (${numberFileSize}KB)`,
                'OPTIMIZED FILE': `${stringFileName}.${currentKey} (${numberNewFileSize}KB)`,
                'TRANSFORMATION RESULT': `${numberChangeInQuiloBytes.toFixed(2)}%`,
            });
            return objectReturn;
        });
        return await Promise.all(arrayFormatPromises);
    });
    console.log('WAIT! OPTIMIZATIONS IN PROGRESS...');
    await Promise.all(arrayFilePromises);
    const arraySortedTableOfResults = arrayTableResults.sort(function (par1, par2) {
        const stringLowerPar1 = par1['ORIGINAL FILE'].toLowerCase();
        const stringLowerPar2 = par2['ORIGINAL FILE'].toLowerCase();
        if (stringLowerPar1 < stringLowerPar2) {
            return -1;
        }
        if (stringLowerPar1 > stringLowerPar2) {
            return 1;
        }
        return 0;
    });
    console.table(arraySortedTableOfResults);
    console.log('END OF OPTIMIZATIONS.');
    return arraySortedTableOfResults;
};
