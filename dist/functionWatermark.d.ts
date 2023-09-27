import { type ResizeOptions, type Sharp } from 'sharp';
export type typeWatermarkOptions = {
    stringWatermarkFile: string;
    numberOpacity: number;
    objectResizeOptions?: ResizeOptions;
    stringGravity?: 'centre' | 'northwest' | 'northeast' | 'southeast' | 'southwest';
};
type typeParameters = {
    parSharp: Sharp;
    parWatermarkOptions?: typeWatermarkOptions;
};
export declare const functionWatermark: ({ parSharp, parWatermarkOptions }: typeParameters) => Promise<void>;
export {};
