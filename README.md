# images-folder-optimizer

This is a high speed package that uses Sharp.js to recurively transform, convert and optimize images from a folder to smaller, web-friendly JPEG, PNG, WebP, GIF and AVIF images of varying dimensions.

## INSTALLATION

```bash
npm install -D images-folder-optimizer
```

## EXAMPLE / USAGE

-   CREATE A JAVASCRIPT (OR TYPECRIPT) FILE, AS `example.js`:

```javascript
import { functionOptimizeImages } from '$lib/index';

functionOptimizeImages({
	stringOriginFolder: 'static/images/originals',
	stringDestinationFolder: 'static/images/optimized',
	arrayExtensionsToAvoid: ['svg'],
	objectResizeOptions: { width: 0.5 }, // 50% RESIZE ON WIDTH AND HEIGHT
});
```

-   RUN THE FILE:

```bash
node example.js
```

## DEVELOPING

ONCE YOU'VE CREATED A PROJECT AND INSTALLED DEPENDENCIES, START A DEVELOPMENT SERVER POWERED BY SVELTEKIT:

```bash
npm run dev
```

EVERYTHING INSIDE `SRC/LIB` IS PART OF YOUR LIBRARY, EVERYTHING INSIDE `SRC/ROUTES` CAN BE USED AS A SHOWCASE OR PREVIEW APP.
