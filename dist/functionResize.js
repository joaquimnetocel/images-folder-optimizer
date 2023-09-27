export const functionResize = async function ({ parSharp, parResizeOptions }) {
    if (parResizeOptions === undefined) {
        return;
    }
    const objectNewResizeOptions = { ...parResizeOptions };
    if (parResizeOptions.width !== undefined) {
        if (parResizeOptions.width < 1) {
            const objectMetadata = await parSharp.metadata();
            if (objectMetadata.width !== undefined) {
                objectNewResizeOptions.width = Math.round(parResizeOptions.width * objectMetadata.width);
                console.log(objectMetadata.width);
            }
        }
    }
    parSharp.resize(objectNewResizeOptions);
};
