import { functionOptimizeImages } from './index.js';
functionOptimizeImages({
    stringOriginFolder: 'static/images/originals',
    stringDestinationFolder: 'static/images/optimized',
    arrayOriginFormats: ['jpg', 'png'],
    arrayDestinationFormats: ['webp', 'avif'],
}).then((results) => {
    console.table(results);
});
