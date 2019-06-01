import dataService from './data.service.js';
import apiService from './api.service.js';
import urlService from './url.service.js';
import viewService from './view.service.js';

(async () => {
    const $table = document.querySelector('#table');
    const { companyID, userID, month } = urlService.getURLParameters(window.location.href);
    const registers = await apiService.getRegisters(companyID, userID);
    const sortedRegisters = dataService.formatAndSort(registers, { month });
    let totalSeconds = 0;

    sortedRegisters.forEach(item => {
        totalSeconds += item.seconds;
        viewService.addItemToTable(item, $table);
    });

    document.querySelector('#total').innerText = `Horas totales: ${viewService.sec2time(totalSeconds)}`;
})();

