import { type ResizeOptions, type Sharp } from 'sharp';

type typeParameters = {
	parSharp: Sharp;
	parResizeOptions?: ResizeOptions;
};

export const functionResize = async function ({ parSharp, parResizeOptions }: typeParameters) {
	if (parResizeOptions === undefined) {
		return;
	}
	const objectNewResizeOptions = { ...parResizeOptions };
	if (parResizeOptions.width !== undefined) {
		if (parResizeOptions.width < 1) {
			const objectMetadata = await parSharp.metadata();
			if (objectMetadata.width !== undefined) {
				objectNewResizeOptions.width = Math.round(parResizeOptions.width * objectMetadata.width);
			}
		}
	}
	// return objectNewResizeOptions;
	parSharp.resize(objectNewResizeOptions);
};
