import { functionOptimizeImages } from './index.js';
functionOptimizeImages({
    stringOriginFolder: 'static/images/originals',
    stringDestinationFolder: 'static/images/optimized',
    arrayInputFormats: ['jpg', 'png'],
    arrayOutputFormats: ['webp', 'tiff'],
    objectWatermarkOptions: {
        numberOpacity: 0.3,
        stringWatermarkFile: 'static/images/originals/logo.png',
        stringGravity: 'southeast',
        objectResizeOptions: {
            width: 0.5,
        },
    },
});
