import { functionOptimizeImages } from './index.js';
functionOptimizeImages({
    stringOriginFolder: 'static/images/originals',
    stringDestinationFolder: 'static/images/optimized',
    arrayInputFormats: ['jpg', 'png'],
    arrayOutputFormats: ['webp', 'avif'],
}).then((results) => console.table(results));
