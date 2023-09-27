export const functionHandleBars = function (parString: string) {
	if (parString.at(0) === '/') {
		parString = parString.slice(1);
	}
	if (parString.at(-1) === '/') {
		parString = parString.slice(0, -1);
	}
	return parString;
};
