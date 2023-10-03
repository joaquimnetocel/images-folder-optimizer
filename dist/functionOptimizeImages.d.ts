import { type AvifOptions, type GifOptions, type JpegOptions, type PngOptions, type ResizeOptions, type TiffOptions, type WebpOptions } from 'sharp';
import { type typeWatermarkOptions } from './functionWatermark.js';
type typeOutputFormats = 'webp' | 'avif' | 'png' | 'jpg' | 'tiff' | 'gif';
type typeInputFormats = typeOutputFormats | 'svg';
type typeParameters = {
    stringOriginFolder: string;
    stringDestinationFolder: string;
    arrayOriginFormats: typeInputFormats[];
    arrayDestinationFormats: typeOutputFormats[];
    objectPngOptions?: PngOptions;
    objectJpegOptions?: JpegOptions;
    objectWebpOptions?: WebpOptions;
    objectAvifOptions?: AvifOptions;
    objectTiffOptions?: TiffOptions;
    objectGifOptions?: GifOptions;
    objectResizeOptions?: ResizeOptions;
    objectBlurOptions?: {
        sigma: number | boolean | undefined;
    };
    objectWatermarkOptions?: typeWatermarkOptions;
    stringFileNameSuffix?: string;
};
export declare const functionOptimizeImages: (objectParameters: typeParameters) => Promise<{
    'ORIGINAL FILE': string;
    'OPTIMIZED FILE': string;
    'TRANSFORMATION RESULT': string;
}[]>;
export {};
