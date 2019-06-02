export function addItemToTable(item, $table) {
	const tr = document.createElement('tr');
	tr.innerHTML = `
                <td>${item.key}</td>
                <td>
                    ${_printRegisters(item.register)}
                </td>
                <td>${sec2time(item.seconds)}</td>
            `;
	$table.appendChild(tr);
	return $table;
}

export function sec2time(timeInSeconds) {
	const time = parseFloat(timeInSeconds).toFixed(3);
	const hours = Math.floor(time / 60 / 60);
	const minutes = Math.floor(time / 60) % 60;

	return _pad(hours, 2) + ':' + _pad(minutes, 2);
}

function _printRegisters(registers) {
	return registers.map(_printRegister).join('');
}

function _printRegister(registerData) {
	const paddedHours = _pad(registerData.date.getHours(), 2);
	const paddedMinutes = _pad(registerData.date.getMinutes(), 2);
	const action = registerData.action === 'SIGN_IN' ? 'Entrada' : 'Salida';
	return `
        <p>
            ${paddedHours}:${paddedMinutes} - ${action}
        </p>
    `;
}

function _pad(num, size) {
	return ('000' + num).slice(size * -1);
}


export default { addItemToTable, sec2time };