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

    const rawData = await fetch(`https://firestore.googleapis.com/v1beta1/projects/easyworkhours/databases/(default)/documents/registers/${companyID}/${userID}`);
    const data = await rawData.json();
    if (!data.documents) {
        return;
    }
    const formatedData = dataService.getDays(dataService.transform(data.documents));
    const sortedData = [];
    let totalSeconds = 0;

    for (const key in formatedData) {
        sortedData.push({
            key: key,
            date: new Date(key),
            register: formatedData[key].register,
            seconds: formatedData[key].seconds,
        });
    }
    sortedData.sort((a, b) => a.date.getTime() - b.date.getTime());

    sortedData.forEach(item => {
        totalSeconds += item.seconds;
        const tr = document.createElement('tr');
        tr.innerHTML = `
                <td>${item.key}</td>
                <td>
                    ${_printRegister(item.register)}
                </td>
                <td>${_sec2time(item.seconds)}</td>
            `;
        $table.appendChild(tr);
    });

    document.querySelector('#total').innerText = `Horas totales: ${_sec2time(totalSeconds)}`;
})();


function _printRegister(registers) {
    return registers.map(register => `<p>${_pad(register.date.getHours(), 2)}:${_pad(register.date.getMinutes(), 2)} - ${register.action === 'SIGN_IN' ? 'Entrada' : 'Salida'}</p>`).join('');
}

function _sec2time(timeInSeconds) {
    const time = parseFloat(timeInSeconds).toFixed(3);
    const hours = Math.floor(time / 60 / 60);
    const minutes = Math.floor(time / 60) % 60;

    return _pad(hours, 2) + ':' + _pad(minutes, 2);
}

function _pad(num, size) {
    return ('000' + num).slice(size * -1);
}