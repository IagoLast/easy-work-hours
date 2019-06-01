export function addItemToTable(item, $table) {
    const tr = document.createElement('tr');
    tr.innerHTML = `
                <td>${item.key}</td>
                <td>
                    ${_printRegister(item.register)}
                </td>
                <td>${sec2time(item.seconds)}</td>
            `;
    $table.appendChild(tr);
    return $table;
}



function _printRegister(registers) {
    return registers.map(register => `<p>${_pad(register.date.getHours(), 2)}:${_pad(register.date.getMinutes(), 2)} - ${register.action === 'SIGN_IN' ? 'Entrada' : 'Salida'}</p>`).join('');
}

export function sec2time(timeInSeconds) {
    const time = parseFloat(timeInSeconds).toFixed(3);
    const hours = Math.floor(time / 60 / 60);
    const minutes = Math.floor(time / 60) % 60;

    return _pad(hours, 2) + ':' + _pad(minutes, 2);
}

function _pad(num, size) {
    return ('000' + num).slice(size * -1);
}


export default { addItemToTable, sec2time};