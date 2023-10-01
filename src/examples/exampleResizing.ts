import { functionOptimizeImages } from '../index.js';

functionOptimizeImages({
	stringOriginFolder: 'static/images/originals',
	stringDestinationFolder: 'static/images/optimized',
	arrayOriginFormats: ['jpg', 'png'],
	arrayDestinationFormats: ['jpg', 'png'],
	objectResizeOptions: {
		width: 0.5, // WHEN THE WIDTH IS SMALLER THAN 1, IT CORRESPONDS TO A PERCENTAGE OF THE ORIGINAL WIDTH AND HEIGHT (IN THIS CASE 50%)
	},
}).then((results) => {
	console.table(results);
});
