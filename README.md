# images-folder-optimizer

<div align="center">
    <img src='./logo.png' width='100' alt='LOGO'>
</div>

A high performance package that uses [sharp.js](https://sharp.pixelplumbing.com/) to recursively optimize, transform and convert images from a folder to smaller, web-friendly JPEG, PNG, WebP, GIF and AVIF images. It is also possible to add watermark to the output images controlling opacity and positioning.

![GITHUB VERSION](https://img.shields.io/github/package-json/v/joaquimnetocel/images-folder-optimizer?label=github%20version&logo=github&color=lightgray) ![NPM VERSION](https://img.shields.io/npm/v/images-folder-optimizer?color=red&logo=npm&label=npm%20version) ![NPM Downloads](https://img.shields.io/npm/dw/images-folder-optimizer?color=red&label=npm%20downloads&logo=npm) ![NPM License](https://img.shields.io/npm/l/images-folder-optimizer?color) [![Twitter](https://img.shields.io/twitter/follow/:twitterHandle.svg?style=social&label=@joaquimnetocel)](https://twitter.com/joaquimnetocel)

## FEATURES

- PROCCESS ALL IMAGE FILES IN A FOLDER AT ONCE
- SIGNIFICANT REDUCTION IN IMAGE SIZE
- SCAN FOR IMAGE FILES RECURSIVELY ON ALL SUBFOLDERS
- CONVERSION BETWEEN IMAGE FORMATS, CHOOSING BOTH INPUT AND OUTPUT FORMATS
- IMAGE RESIZING
- IMAGE TRANSFORMATIONS (ONLY BLUR FOR NOW)
- POSSIBILITY TO OVERLAP A WATERMARK IMAGE CONTROLLING ITS OPACITY
- FULL TYPESCRIPT SUPPORT
- FULL CONTROL FOR SHARP.JS PARAMETERS

## HOW TO USE IN YOUR PROJECT

- INSTALL THE PACKAGE:

  ```bash
  npm install -D images-folder-optimizer
  ```

- CREATE A JAVASCRIPT (OR TYPESCRIPT) FILE, AS `example.js`:

  ```javascript
  import { functionOptimizeImages } from 'images-folder-optimizer';

  functionOptimizeImages({
      stringOriginFolder: 'static/images/originals',
      stringDestinationFolder: 'static/images/optimized',
      arrayOriginFormats: ['jpg', 'png'],
      arrayDestinationFormats: ['webp', 'avif'],
  }).then((results) => {
      console.table(results);
  });
  ```

- RUN THE FILE:

  ```bash
  node example.js
  ```

- CHECK THE NEW IMAGES IN `static/images/optimized`.

## BUILT-IN EXAMPLES

YOU CAN FIND BUILT-IN EXAMPLES IN `src/examples/` [[LINK](https://github.com/joaquimnetocel/images-folder-optimizer/tree/main/src/examples)]. LET'S TRY ONE OF THEM:

  ```bash
  npx tsc
  node dist/examples/exampleFormatConversion.js
  ```

## PARAMETERS AND TYPING

- PARAMETERS FOR `functionOptimizeImages`:

| PARAMETER | DESCRIPTION | TYPE | REQUIRED | DEFAULT |
| - | - | - | - | - |
| `stringOriginFolder` | THE FOLDER WITH THE ORIGINAL IMAGES | `string` | YES | - |
| `stringDestinationFolder` | THE FOLDER WHERE THE OPTIMIZED IMAGES ARE GOING TO BE SAVED | `string` | YES | - |
| `arrayOriginFormats` | FORMATS OF THE ORIGINAL IMAGES | ARRAY WITH ELEMENTS BEEING 'webp' OR 'avif' OR 'png' OR 'jpg' OR 'tiff' OR 'gif' | YES | - |
| `arrayDestinationFormats` | FORMATS FOR THE NEW IMAGES | ARRAY WITH ELEMENTS BEEING 'webp' OR 'avif' OR 'png' OR 'jpg' OR 'tiff' OR 'gif' OR 'svg' | YES | - |
| objectResizeOptions | SHARP.JS OPTIONS FOR IMAGE RESIZING | [CHECK IT HERE](https://sharp.pixelplumbing.com/api-resize#resize) | NO | - |
| objectPngOptions | SHARP.JS OPTIONS FOR PNG TRANSFORMATIONS | [CHECK IT HERE](https://sharp.pixelplumbing.com/api-output#png) | NO | - |
| objectJpegOptions | SHARP.JS OPTIONS FOR JPG TRANSFORMATIONS | [CHECK IT HERE](https://sharp.pixelplumbing.com/api-output#jpeg) | NO | - |
| objectWebpOptions | SHARP.JS OPTIONS FOR WEBP TRANSFORMATIONS | [CHECK IT HERE](https://sharp.pixelplumbing.com/api-output#webp) | NO | - |
| objectAvifOptions | SHARP.JS OPTIONS FOR AVIF TRANSFORMATIONS | [CHECK IT HERE](https://sharp.pixelplumbing.com/api-output#avif) | NO | - |
| objectAvifOptions | SHARP.JS OPTIONS FOR AVIF TRANSFORMATIONS | [CHECK IT HERE](https://sharp.pixelplumbing.com/api-output#avif) | NO | - |
| objectTiffOptions | SHARP.JS OPTIONS FOR TIFF TRANSFORMATIONS | [CHECK IT HERE](https://sharp.pixelplumbing.com/api-output#tiff) | NO | - |
| objectGifOptions | SHARP.JS OPTIONS FOR GIF TRANSFORMATIONS | [CHECK IT HERE](https://sharp.pixelplumbing.com/api-output#gif) | NO | - |
| objectBlurOptions | SHARP.JS OPTIONS FOR BLUR TRANSFORMATIONS | [CHECK IT HERE](https://sharp.pixelplumbing.com/api-operation#blur) | NO | - |
| objectWatermarkOptions | OBJECT WITH OPTIONS FOR WATERMARK INSERTION | `typeWatermarkOptions` DESCRIBED BELLOW | NO | - |

- typeWatermarkOptions TYPE:

| KEY | DESCRIPTION | TYPE | REQUIRED | DEFAULT |
| - | - | - | - | - |
| stringWatermarkFile | PATH OF THE IMAGE TO USE AS WATERMARK | `string` | YES | - |
| numberOpacity | WATERMARK OPACITY | `number` BETWEEN 0 AND 1 | YES | - |
| objectResizeOptions | SHARP.JS OPTIONS FOR RESIZING THE WATERMARK IMAGE | [CHECK IT HERE](https://sharp.pixelplumbing.com/api-resize#resize) | NO | - |
| stringGravity | WATERMARK POSITION | 'centre' OR 'northwest' OR 'northeast' OR 'southeast' OR 'southwest' | NO | `centre` |
