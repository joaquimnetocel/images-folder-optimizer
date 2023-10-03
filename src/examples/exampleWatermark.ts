import { functionOptimizeImages } from '../index.js';

functionOptimizeImages({
	stringOriginFolder: 'static/images/originals',
	stringDestinationFolder: 'static/images/optimized',
	arrayOriginFormats: ['jpg', 'png'],
	arrayDestinationFormats: ['jpg', 'png'],
	objectWatermarkOptions: {
		numberOpacity: 0.3,
		stringWatermarkFile: 'static/images/originals/watermark.png',
		stringGravity: 'centre',
		objectResizeOptions: {
			width: 1, // WHEN THE WIDTH IS SMALLER OR EQUAL 1, IT CORRESPONDS TO A PERCENTAGE OF THE ORIGINAL IMAGE WIDTH AND HEIGHT (IN THIS CASE 100%)
			height: 1, // WHEN THE HEIGHT IS SMALLER OR EQUAL 1, IT CORRESPONDS TO A PERCENTAGE OF THE ORIGINAL IMAGE HEIGHT AND HEIGHT (IN THIS CASE 100%)
			fit: 'inside',
		},
	},
}).then((results) => {
	console.table(results);
});
