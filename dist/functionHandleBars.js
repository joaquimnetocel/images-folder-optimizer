export const functionHandleBars = function (parString) {
    if (parString.at(0) === '/') {
        parString = parString.slice(1);
    }
    if (parString.at(-1) === '/') {
        parString = parString.slice(0, -1);
    }
    return parString;
};
