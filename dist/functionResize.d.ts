import { type ResizeOptions, type Sharp } from 'sharp';
type typeParameters = {
    parSharp: Sharp;
    parResizeOptions?: ResizeOptions;
};
export declare const functionResize: ({ parSharp, parResizeOptions }: typeParameters) => Promise<void>;
export {};
