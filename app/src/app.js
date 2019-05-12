import dataService from './data.service.js';


(async () => {
    const $table = document.querySelector('#table');
    const url = new URL(window.location.href);
    const searchParams = new URLSearchParams(url.search);
    const q = searchParams.get('q');

    if (!q) {
        return
    }

    const [companyID, userID] = atob(q).split(':');

    if (!companyID || !userID) {
        return;
    }

    const rawData = await fetch(`https://firestore.googleapis.com/v1beta1/projects/easyworkhours/databases/(default)/documents/${companyID}/${userID}/data`);
    const data = await rawData.json();
    if (!data.documents) {
        return;
    }
    const formatedData = dataService.getDays(dataService.transform(data.documents));
    const sortedData = [];

    for (const key in formatedData) {
        sortedData.push({
            key: key,
            date: new Date(key),
            register: formatedData[key].register,
            hours: formatedData[key].hours,
        });
    }
    sortedData.sort((a, b) => a.date.getTime() - b.date.getTime());

    sortedData.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
                <td>${item.key}</td>
                <td>
                    ${_printRegister(item.register)}
                </td>
                <td>${item.hours.toFixed(3)}</td>
            `;
        $table.appendChild(tr);
    })
})();


function _printRegister(registers) {
    return registers.map(register => `<p>${register.date.getHours()}:${register.date.getMinutes()} - ${register.action === 'SIGN_IN' ? 'Entrada' : 'Salida'}</p>`).join('');
}