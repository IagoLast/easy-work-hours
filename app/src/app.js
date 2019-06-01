import dataService from './data.service.js';
import apiService from './api.service.js';
import urlService from './url.service.js';
import viewService from './view.service.js';

(async () => {
    _setupFilter();
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

function _setupFilter() {
    const url = new URL(window.location.href);
    const searchParams = new URLSearchParams(url.search);
    const $selectMonth = document.querySelector('#select-month');
  
    $selectMonth.value = searchParams.get('m');

    $selectMonth.addEventListener('change', e => {
        const m = event.target.value;
        searchParams.set('m', m);
        window.location.href = `${window.location.href.split('?')[0]}?${searchParams.toString()}`;
    });
}