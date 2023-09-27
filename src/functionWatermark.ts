import sharp, { type Gravity, type ResizeOptions, type Sharp } from 'sharp';
import { functionResize } from './functionResize.js';

export type typeWatermarkOptions = {
	stringWatermarkFile: string;
	numberOpacity: number;
	objectResizeOptions?: ResizeOptions;
	stringGravity: Gravity;
};

type typeParameters = {
	parSharp: Sharp;
	parWatermarkOptions?: typeWatermarkOptions;
};

export const functionWatermark = async function ({ parSharp, parWatermarkOptions }: typeParameters) {
	if (parWatermarkOptions === undefined) {
		return;
	}
	const objectNewWatermarkOptions = { ...parWatermarkOptions };
	if (objectNewWatermarkOptions.numberOpacity > 1) {
		return;
	}
	if (objectNewWatermarkOptions.numberOpacity < 0) {
		return;
	}

	const objectMetadata = await parSharp.metadata();

	if (objectMetadata.width === undefined) {
		return;
	}
	if (objectMetadata.height === undefined) {
		return;
	}

	if (objectNewWatermarkOptions.objectResizeOptions === undefined) {
		objectNewWatermarkOptions.objectResizeOptions = {
			width: objectMetadata.width,
			height: objectMetadata.height,
		};
	}

	// TRUNCATE WATERMARK WIDTH TO IMAGE WIDTH
	if (objectNewWatermarkOptions.objectResizeOptions?.width !== undefined) {
		objectNewWatermarkOptions.objectResizeOptions.width = objectNewWatermarkOptions.objectResizeOptions.width > objectMetadata.width ? objectMetadata.width : objectNewWatermarkOptions.objectResizeOptions.width;
	}
	/////
	// TRUNCATE WATERMARK HEIGHT TO IMAGE HEIGHT
	if (objectNewWatermarkOptions.objectResizeOptions?.height !== undefined) {
		objectNewWatermarkOptions.objectResizeOptions.height = objectNewWatermarkOptions.objectResizeOptions.height > objectMetadata.height ? objectMetadata.height : objectNewWatermarkOptions.objectResizeOptions.height;
	}
	/////

	const sharpedWatermark = sharp(objectNewWatermarkOptions.stringWatermarkFile);

	await functionResize({
		parSharp: sharpedWatermark,
		parResizeOptions: objectNewWatermarkOptions.objectResizeOptions,
	});
	// if (objectNewResizeOptions !== undefined) {
	// 	const bb = await sharpedWatermark.resize(50).toBuffer();
	// 	// const oioi = await bb.clone().metadata();
	// 	console.log(bb);
	// }

	sharpedWatermark.composite([
		{
			input: Buffer.from([0, 0, 0, 255 * objectNewWatermarkOptions.numberOpacity]),
			raw: {
				width: 1,
				height: 1,
				channels: 4,
			},
			tile: true,
			blend: 'dest-in',
		},
	]);
	const buffer = await sharpedWatermark.toBuffer();

	parSharp.composite([{ input: buffer }]);
	//, gravity: objectNewWatermarkOptions.stringGravity
};
