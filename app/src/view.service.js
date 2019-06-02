import utils from './util.service.js';

export function addItemToTable(item, $table) {
	const tr = document.createElement('tr');
	tr.innerHTML = `
                <td>${item.key}</td>
                <td>
                    ${_printRegisters(item.register)}
                </td>
                <td>${utils.sec2time(item.seconds)}</td>
            `;
	$table.appendChild(tr);
	return $table;
}

function _printRegisters(registers) {
	return registers.map(_printRegister).join('');
}

function _printRegister(registerData) {
	const paddedHours = utils.pad(registerData.date.getHours(), 2);
	const paddedMinutes = utils.pad(registerData.date.getMinutes(), 2);
	const action = registerData.action === 'SIGN_IN' ? 'Entrada' : 'Salida';
	return `
        <p>
            ${paddedHours}:${paddedMinutes} - ${action}
        </p>
    `;
}

export default { addItemToTable };