// npm install -D @types/node
// npm install -D sharp
import fs from 'fs';
import path from 'path';
import sharp, {
	type AvifOptions,
	type JpegOptions,
	type PngOptions,
	type ResizeOptions,
	type Sharp,
	type WebpOptions,
} from 'sharp';

const functionExtractNameAndExtension = function (parFullFileName: string) {
	const arrayReturn = path.basename(parFullFileName || '').split('.');
	return {
		stringFileName: arrayReturn[0],
		stringFileExtension: arrayReturn[1],
	};
};

const functionHandleBars = function (parString: string) {
	if (parString.at(0) === '/') {
		parString = parString.slice(1);
	}
	if (parString.at(-1) === '/') {
		parString = parString.slice(0, -1);
	}
	return parString;
};

type typeParameters = {
	stringOriginFolder: string;
	stringDestinationFolder: string;
	arrayExtensionsToAvoid: string[];
	objectPngOptions?: PngOptions;
	objectJpegOptions?: JpegOptions;
	objectWebpOptions?: WebpOptions;
	objectAvifOptions?: AvifOptions;
	objectResizeOptions?: ResizeOptions;
};

export const functionOptimizeImages = async function ({
	stringOriginFolder,
	stringDestinationFolder,
	arrayExtensionsToAvoid = ['svg'],
	objectWebpOptions,
	objectAvifOptions,
	objectJpegOptions,
	objectPngOptions,
	objectResizeOptions,
}: typeParameters) {
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

	const arrayFilePromises = arrayFileNames.map(
		async (currentFullFileName) => {
			const { stringFileName, stringFileExtension } =
				functionExtractNameAndExtension(currentFullFileName);

			if (stringFileExtension === undefined) {
				return;
			}
			if (arrayExtensionsToAvoid.includes(stringFileExtension)) {
				return;
			}

			const sharpedFile = sharp(
				`${stringOriginFolder}/${currentFullFileName}`,
			);
			const numberFileSize = Math.ceil(
				fs.statSync(`${stringOriginFolder}/${currentFullFileName}`)
					.size / 1024,
			);

			const functionResize = async function () {
				if (objectResizeOptions === undefined) {
					return;
				}
				const objectNewResizeOptions = { ...objectResizeOptions };
				if (objectResizeOptions.width !== undefined) {
					if (objectResizeOptions.width < 1) {
						const { width: numberOriginalWidth } =
							await sharpedFile.metadata();
						if (numberOriginalWidth !== undefined) {
							objectNewResizeOptions.width = Math.round(
								objectResizeOptions.width * numberOriginalWidth,
							);
						}
					}
				}
				sharpedFile.resize(objectNewResizeOptions);
			};
			await functionResize();

			const objectOptimizations: {
				[key in 'webp' | 'avif' | 'jpg' | 'png']?: Sharp;
			} = {};
			objectOptimizations.webp = sharpedFile
				.clone()
				.webp(objectWebpOptions);
			objectOptimizations.avif = sharpedFile
				.clone()
				.avif(objectAvifOptions);
			if (stringFileExtension === 'jpg') {
				objectOptimizations.jpg = sharpedFile
					.clone()
					.jpeg(objectJpegOptions);
			}
			if (stringFileExtension === 'png') {
				objectOptimizations.png = sharpedFile
					.clone()
					.png(objectPngOptions);
			}

			const arrayEntries = Object.entries(objectOptimizations);

			const arrayFormatPromises = arrayEntries.map(
				async ([currentKey, currentValue]) => {
					if (
						!fs.existsSync(
							`${stringDestinationFolder}/${currentKey}`,
						)
					) {
						fs.mkdirSync(
							`${stringDestinationFolder}/${currentKey}`,
						);
					}
					const objectReturn = await currentValue.toFile(
						`${stringDestinationFolder}/${currentKey}/${stringFileName}.${currentKey}`,
					);
					const numberNewFileSize = Math.ceil(
						objectReturn.size / 1024,
					);
					const numberChangeInQuiloBytes =
						((numberNewFileSize - numberFileSize) /
							numberFileSize) *
						100;
					arrayTableResults.push({
						'ORIGINAL FILE': `${currentFullFileName} (${numberFileSize}KB)`,
						'OPTIMIZED FILE': `${stringFileName}.${currentKey} (${numberNewFileSize}KB)`,
						'TRANSFORMATION RESULT': `${numberChangeInQuiloBytes.toFixed(
							2,
						)}%`,
					});
					return objectReturn;
				},
			);
			return await Promise.all(arrayFormatPromises);
		},
	);
	console.log('WAIT! OPTIMIZATIONS IN PROGRESS...');
	await Promise.all(arrayFilePromises);
	const arraySortedTableOfResults = arrayTableResults.sort(
		function (par1, par2) {
			const stringLowerPar1 = par1['ORIGINAL FILE'].toLowerCase();
			const stringLowerPar2 = par2['ORIGINAL FILE'].toLowerCase();
			if (stringLowerPar1 < stringLowerPar2) {
				return -1;
			}
			if (stringLowerPar1 > stringLowerPar2) {
				return 1;
			}
			return 0;
		},
	);
	console.table(arraySortedTableOfResults);
	console.log('END OF OPTIMIZATIONS.');
	return arraySortedTableOfResults;
};
