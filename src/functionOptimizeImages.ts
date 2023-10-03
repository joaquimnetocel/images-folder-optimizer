// npm install -D @types/node
// npm install -D sharp
import fs from 'fs';
import path from 'path';
import sharp, { type AvifOptions, type GifOptions, type JpegOptions, type PngOptions, type ResizeOptions, type Sharp, type TiffOptions, type WebpOptions } from 'sharp';
import { functionExtractNameAndExtension } from './functionExtractNameAndExtension.js';
import { functionHandleBars } from './functionHandleBars.js';
import { functionResize } from './functionResize.js';
import { functionWatermark, type typeWatermarkOptions } from './functionWatermark.js';

type typeOutputFormats = 'webp' | 'avif' | 'png' | 'jpg' | 'tiff' | 'gif';
type typeInputFormats = typeOutputFormats | 'svg';

export type typeOptimizationOptions = {
	stringOriginFolder: string;
	stringDestinationFolder: string;
	arrayOriginFormats: typeInputFormats[];
	arrayDestinationFormats: typeOutputFormats[];
	objectPngOptions?: PngOptions;
	objectJpegOptions?: JpegOptions;
	objectWebpOptions?: WebpOptions;
	objectAvifOptions?: AvifOptions;
	objectTiffOptions?: TiffOptions;
	objectGifOptions?: GifOptions;
	objectResizeOptions?: ResizeOptions;
	objectBlurOptions?: { sigma: number | boolean | undefined };
	objectWatermarkOptions?: typeWatermarkOptions;
	stringFileNameSuffix?: string;
};

export const functionOptimizeImages = async function (objectParameters: typeOptimizationOptions) {
	const { stringOriginFolder, stringDestinationFolder, arrayOriginFormats = ['avif', 'gif', 'jpg', 'png', 'svg', 'tiff', 'webp'], arrayDestinationFormats, objectWebpOptions, objectAvifOptions, objectTiffOptions, objectJpegOptions, objectPngOptions, objectGifOptions, objectResizeOptions, objectBlurOptions, objectWatermarkOptions, stringFileNameSuffix } = objectParameters;
	const stringNewOriginFolder = functionHandleBars(stringOriginFolder);
	const stringNewDestinationFolder = functionHandleBars(stringDestinationFolder);

	type typeTableResults = {
		'ORIGINAL FILE': string;
		'OPTIMIZED FILE': string;
		'TRANSFORMATION RESULT': string;
	};
	const arrayTableResults: typeTableResults[] = [];

	if (!fs.existsSync(stringNewDestinationFolder)) {
		fs.mkdirSync(stringNewDestinationFolder);
	}

	const arrayFolderContent = fs.readdirSync(stringNewOriginFolder, { withFileTypes: true });
	const arrayFileNames = arrayFolderContent.filter((current) => !current.isDirectory()).map((current) => current.name);
	const arraySubFolderNames = arrayFolderContent.filter((current) => current.isDirectory()).map((current) => current.name);

	// APPLY RECURSIVELY ON SUBFOLDERS
	const arraySubfolderPromises = arraySubFolderNames.map((currentSubfolder) => {
		const objectNewParameters = { ...objectParameters };
		objectNewParameters.stringOriginFolder = path.join(stringNewOriginFolder, currentSubfolder);
		objectNewParameters.stringDestinationFolder = path.join(stringNewDestinationFolder, currentSubfolder);
		return functionOptimizeImages(objectNewParameters);
	});
	const arraySubfolderResults = (await Promise.all(arraySubfolderPromises)).flat();
	arrayTableResults.push(...arraySubfolderResults);
	/////

	console.log(`OPTIMIZING THE FOLDER ${stringNewOriginFolder} WITH THE FOLLOWING FILES: ${arrayFileNames.join(', ')}`);

	const arrayFilePromises = arrayFileNames.map(async (currentFullFileName) => {
		const { stringFileName, stringFileExtension } = functionExtractNameAndExtension(currentFullFileName);

		if (stringFileExtension === undefined) {
			return;
		}
		if (!arrayOriginFormats.includes(stringFileExtension as typeInputFormats)) {
			return;
		}

		const sharpOriginalFile = sharp(`${stringNewOriginFolder}/${currentFullFileName}`);
		const numberFileSize = Math.ceil(fs.statSync(`${stringNewOriginFolder}/${currentFullFileName}`).size / 1024);

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

		const objectOptimizations: {
			[key in typeOutputFormats]?: Sharp;
		} = {};

		if (arrayDestinationFormats.includes('webp')) {
			objectOptimizations.webp = sharpFile.clone().webp(objectWebpOptions);
		}
		if (arrayDestinationFormats.includes('avif')) {
			objectOptimizations.avif = sharpFile.clone().avif(objectAvifOptions);
		}
		if (arrayDestinationFormats.includes('jpg')) {
			objectOptimizations.jpg = sharpFile.clone().jpeg(objectJpegOptions);
		}
		if (arrayDestinationFormats.includes('png')) {
			objectOptimizations.png = sharpFile.clone().png(objectPngOptions);
		}
		if (arrayDestinationFormats.includes('tiff')) {
			objectOptimizations.tiff = sharpFile.clone().tiff(objectTiffOptions);
		}
		if (arrayDestinationFormats.includes('gif')) {
			objectOptimizations.gif = sharpFile.clone().gif(objectGifOptions);
		}

		const arrayEntries = Object.entries(objectOptimizations);

		const arrayFormatPromises = arrayEntries.map(async ([currentKey, currentValue]) => {
			if (arrayDestinationFormats.length !== 1) {
				if (!fs.existsSync(`${stringNewDestinationFolder}/${currentKey}`)) {
					fs.mkdirSync(`${stringNewDestinationFolder}/${currentKey}`);
				}
			} else {
				if (!fs.existsSync(stringNewDestinationFolder)) {
					fs.mkdirSync(stringNewDestinationFolder);
				}
			}

			const objectReturn = await functionSaveFile();
			function functionSaveFile() {
				if (arrayDestinationFormats.length === 1) {
					return currentValue.toFile(`${stringNewDestinationFolder}/${stringFileName}${stringFileNameSuffix ?? ''}.${currentKey}`);
				}
				return currentValue.toFile(`${stringNewDestinationFolder}/${currentKey}/${stringFileName}${stringFileNameSuffix ?? ''}.${currentKey}`);
			}

			const numberNewFileSize = Math.ceil(objectReturn.size / 1024);
			const numberChangeInQuiloBytes = ((numberNewFileSize - numberFileSize) / numberFileSize) * 100;
			arrayTableResults.push({
				'ORIGINAL FILE': `${path.join(stringNewOriginFolder, currentFullFileName)} (${numberFileSize}KB)`,
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
	console.log('END OF OPTIMIZATIONS.');
	return arraySortedTableOfResults;
};
