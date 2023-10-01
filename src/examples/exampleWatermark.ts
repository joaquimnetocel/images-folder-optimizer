import { functionOptimizeImages } from '../index.js';

functionOptimizeImages({
	stringOriginFolder: 'static/images/originals',
	stringDestinationFolder: 'static/images/optimized',
	arrayOriginFormats: ['jpg', 'png'],
	arrayDestinationFormats: ['jpg', 'png'],
	objectWatermarkOptions: {
		numberOpacity: 0.4,
		stringWatermarkFile: 'static/images/originals/logo.png',
		stringGravity: 'southeast',
		objectResizeOptions: {
			width: 0.2, // WHEN THE WIDTH IS SMALLER THAN 1, IT CORRESPONDS TO A PERCENTAGE OF THE ORIGINAL IMAGE WIDTH AND HEIGHT (IN THIS CASE 20%)
		},
	},
}).then((results) => {
	console.table(results);
});
