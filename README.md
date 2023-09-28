# images-folder-optimizer

![GITHUB VERSION](https://img.shields.io/github/package-json/v/joaquimnetocel/images-folder-optimizer?label=github%20version&logo=github&color=lightgray) ![NPM VERSION](https://img.shields.io/npm/v/images-folder-optimizer?color=red&logo=npm&label=npm%20version) ![NPM Downloads](https://img.shields.io/npm/dw/images-folder-optimizer?color=red&label=npm%20downloads&logo=npm) ![NPM License](https://img.shields.io/npm/l/images-folder-optimizer?color) [![Twitter](https://img.shields.io/twitter/follow/:twitterHandle.svg?style=social&label=@joaquimnetocel)](https://twitter.com/joaquimnetocel)

This is a high speed package that uses [sharp.js](https://sharp.pixelplumbing.com/) to recurively transform, convert and optimize images from a folder to smaller, web-friendly JPEG, PNG, WebP, GIF and AVIF images. It is also possible to add watermark to the output images controlling opacity and positioning.

## FEATURES

- PROCCESS ALL IMAGE FILES IN A FOLDER AT ONCE
- SCAN FOR IMAGE FILES RECURSIVELY ON ALL SUBFOLDERS
- CONVERSION BETWEEN IMAGE FORMATS, CHOOSING BOTH INPUT AND OUTPUT FORMATS
- IMAGE RESIZING
- IMAGE TRANSFORMATIONS (ONLY BLUR FOR NOW)
- POSSIBILITY TO OVERLAP A WATERMARK IMAGE CONTROLLING ITS OPACITY
- FULL TYPESCRIPT SUPPORT
- FULL CONTROL FOR SHARP.JS PARAMETERS

## USAGE

### IN YOUR PROJECT

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
      arrayInputFormats: ['jpg', 'png'],
      arrayOutputFormats: ['webp', 'avif'],
  }).then((results) => {
      console.table(results);
  });
  ```

- RUN THE FILE:

  ```bash
  node example.js
  ```

### BUILT-IN EXAMPLE

YOU CAN TRY A BUILT-IN EXAMPLE WITH:

  ```bash
  npx tsc
  node dist/example.js
  ```

OR WITH THE EQUIVALENT NPM SCRIPT:

  ```bash
  npm run example
  ```

## PARAMETERS

<!-- ### FOR `functionOptimizeImages`

| PARAMETER | DESCRIPTION | TYPE | REQUIRED | DEFAULT |
| - | - | - | - | - |
| `stringOriginFolder` | THE FOLDER WITH THE ORIGINAL IMAGES | `string` | YES | - | -->

UNDER CONSTRUCTION...
