export function getURLParameters(href) {
    const url = new URL(href);
    const searchParams = new URLSearchParams(url.search);
    const q = searchParams.get('q');

    if (!q) {
        throw new Error('INVALID_URL: No "q" parameter found');
    }

    const [companyID, userID] = atob(q).split(':');

    if (!companyID || !userID) {
        throw new Error('INVALID_URL: No companyID or no userID');
    }

    return { companyID, userID };
}


export default { getURLParameters };