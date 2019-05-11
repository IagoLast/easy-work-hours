import dataService from './data.service.js';


(async () => {
    const url = new URL(window.location.href);
    const searchParams = new URLSearchParams(url.search);
    const companyID = searchParams.get('companyID');
    const userID = searchParams.get('userID');
    const $table = document.querySelector('#table');

    const rawData = await fetch(`https://firestore.googleapis.com/v1beta1/projects/proyecto-generico-205719/databases/(default)/documents/${companyID}/${userID}/data`);
    const data = await rawData.json();
    if (!data.documents) {
        return;
    }
    const formatedData = dataService.getDays(dataService.transform(data.documents));

    for (const key in formatedData) {
        const item = formatedData[key];
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${key}</td>
            <td>
                ${_printRegister(item.register)}
            </td>
            <td>${item.hours.toFixed(3)}</td>
        `;
        $table.appendChild(tr);
    }
})();


function _printRegister(registers) {
    return registers.map(register => `<p>${register.date.getHours()}:${register.date.getMinutes()} - ${register.action === 'SIGN_IN' ? 'Entrada' : 'Salida'}</p>`).join('');
}