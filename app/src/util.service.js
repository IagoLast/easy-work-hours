export function pad(num, size) {
	return ('000' + num).slice(size * -1);
}

export function sec2time(timeInSeconds) {
	const time = parseFloat(timeInSeconds).toFixed(3);
	const hours = Math.floor(time / 60 / 60);
	const minutes = Math.floor(time / 60) % 60;

	return pad(hours, 2) + ':' + pad(minutes, 2);
}


export default {
	pad,
	sec2time
};