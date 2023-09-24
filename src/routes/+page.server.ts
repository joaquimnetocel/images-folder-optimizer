import { functionOptimizeImages } from '$lib/index';
import type { PageServerLoad } from './$types';

export const load = (async () => {
	return {
		results: functionOptimizeImages({
			stringOriginFolder: 'static/images/originals',
			stringDestinationFolder: 'static/images/optimized',
			arrayExtensionsToAvoid: ['svg'],
			objectWebpOptions: {
				force: true,
			},
			objectAvifOptions: {
				force: true,
			},
			objectJpegOptions: {
				mozjpeg: true,
			},
			objectResizeOptions: { width: 0.5 },
		}),
	};
}) satisfies PageServerLoad;
