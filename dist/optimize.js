import { functionOptimizeImages } from './index.js';
functionOptimizeImages({
    stringOriginFolder: 'static/images/originals',
    stringDestinationFolder: 'static/images/optimized',
    arrayInputFormats: ['jpg', 'png'],
    arrayOutputFormats: ['webp', 'tiff'],
    objectWatermarkOptions: {
        numberOpacity: 0.1,
        stringWatermarkFile: 'static/images/originals/logo.png',
        stringGravity: 'centre',
    },
    objectResizeOptions: {
        width: 0.5,
    },
});
