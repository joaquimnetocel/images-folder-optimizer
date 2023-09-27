// npm install -D @types/node
// npm install -D sharp
import fs from 'fs';
import sharp, { type AvifOptions, type GifOptions, type JpegOptions, type PngOptions, type ResizeOptions, type Sharp, type TiffOptions, type WebpOptions } from 'sharp';
import { functionExtractNameAndExtension } from './functionExtractNameAndExtension.js';
import { functionHandleBars } from './functionHandleBars.js';
import { functionResize } from './functionResize.js';
import { functionWatermark, type typeWatermarkOptions } from './functionWatermark.js';

type typeOutputFormats = 'webp' | 'avif' | 'png' | 'jpg' | 'tiff' | 'gif';
type typeInputFormats = typeOutputFormats | 'svg';

type typeParameters = {
	stringOriginFolder: string;
	stringDestinationFolder: string;
	arrayInputFormats: typeInputFormats[];
	arrayOutputFormats: typeOutputFormats[];
	objectPngOptions?: PngOptions;
	objectJpegOptions?: JpegOptions;
	objectWebpOptions?: WebpOptions;
	objectAvifOptions?: AvifOptions;
	objectTiffOptions?: TiffOptions;
	objectGifOptions?: GifOptions;
	objectResizeOptions?: ResizeOptions;
	objectBlurOptions?: { sigma: number | boolean | undefined };
	objectWatermarkOptions?: typeWatermarkOptions;
};

export const functionOptimizeImages = async function ({ stringOriginFolder, stringDestinationFolder, arrayInputFormats = ['avif', 'gif', 'jpg', 'png', 'svg', 'tiff', 'webp'], arrayOutputFormats, objectWebpOptions, objectAvifOptions, objectTiffOptions, objectJpegOptions, objectPngOptions, objectGifOptions, objectResizeOptions, objectBlurOptions, objectWatermarkOptions }: typeParameters) {
	stringOriginFolder = functionHandleBars(stringOriginFolder);
	stringDestinationFolder = functionHandleBars(stringDestinationFolder);

	type typeTableResults = {
		'ORIGINAL FILE': string;
		'OPTIMIZED FILE': string;
		'TRANSFORMATION RESULT': string;
	};
	const arrayTableResults: typeTableResults[] = [];

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
		if (!arrayInputFormats.includes(stringFileExtension as typeInputFormats)) {
			return;
		}

		const sharpedFile = sharp(`${stringOriginFolder}/${currentFullFileName}`);
		const numberFileSize = Math.ceil(fs.statSync(`${stringOriginFolder}/${currentFullFileName}`).size / 1024);

		// await functionResize({
		// 	parSharp: sharpedFile,
		// 	parResizeOptions: objectResizeOptions,
		// });
		await functionWatermark({
			parSharp: sharpedFile,
			parWatermarkOptions: objectWatermarkOptions,
		});

		if (objectBlurOptions !== undefined) {
			sharpedFile.blur(objectBlurOptions.sigma);
		}

		const objectOptimizations: {
			[key in typeOutputFormats]?: Sharp;
		} = {};

		if (arrayOutputFormats.includes('webp')) {
			objectOptimizations.webp = sharpedFile.clone().webp(objectWebpOptions);
		}
		if (arrayOutputFormats.includes('avif')) {
			objectOptimizations.avif = sharpedFile.clone().avif(objectAvifOptions);
		}
		if (arrayOutputFormats.includes('jpg')) {
			if (stringFileExtension === 'jpg') {
				objectOptimizations.jpg = sharpedFile.clone().jpeg(objectJpegOptions);
			}
		}
		if (arrayOutputFormats.includes('png')) {
			if (stringFileExtension === 'png') {
				objectOptimizations.png = sharpedFile.clone().png(objectPngOptions);
			}
		}
		if (arrayOutputFormats.includes('tiff')) {
			objectOptimizations.tiff = sharpedFile.clone().tiff(objectTiffOptions);
		}
		if (arrayOutputFormats.includes('gif')) {
			objectOptimizations.gif = sharpedFile.clone().gif(objectGifOptions);
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
