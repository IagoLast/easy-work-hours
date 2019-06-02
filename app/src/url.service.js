export function getURLParameters(href) {
	const url = new URL(href);
	const searchParams = new URLSearchParams(url.search);
	const q = searchParams.get('q');
	const m = searchParams.get('m');
	let month;

	if (!q) {
		throw new Error('INVALID_URL: No "q" parameter found');
	}

	const [companyID, userID] = atob(q).split(':');

	if (!companyID || !userID) {
		throw new Error('INVALID_URL: No companyID or no userID');
	}

	if (m) {
		month = parseInt(m);
		if (isNaN(month)) {
			throw new Error('INVALID_URL: No "m" is not a valid integer');
		}
	}

	return { companyID, userID, month };
}

export function build(searchParams) {
	return `${window.location.href.split('?')[0]}?${searchParams.toString()}`;

}


export default { getURLParameters, build };