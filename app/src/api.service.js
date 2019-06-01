const API_URL = 'https://firestore.googleapis.com/v1beta1/projects/easyworkhours/databases/(default)/documents/registers/';

async function getRegisters(companyID, userID) {
    const rawData = await fetch(`${API_URL}${companyID}/${userID}`);
    const data = await rawData.json();
    if (!data.documents) {
        return [];
    }
    return data.documents;
}

export default { getRegisters };