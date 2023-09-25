import { functionOptimizeImages } from './index.js';

functionOptimizeImages({
	stringOriginFolder: 'static/images/originals',
	stringDestinationFolder: 'static/images/optimized',
	arrayExtensionsToAvoid: ['svg'],
	objectWebpOptions: {
		force: true,
	},
	objectAvifOptions: {
		force: true,
	},
	objectJpegOptions: {
		mozjpeg: true,
	},
	objectResizeOptions: { width: 0.5 },
});
