import dataService from './data.service.js';
import registerService from './register.service.js';
import urlService from './url.service.js';
import viewService from './view.service.js';


export default class App {
	constructor() {
		this.url = new URL(window.location.href);

		this.searchParams = new URLSearchParams(this.url.search);
		this.$selectMonth = document.querySelector('#select-month');
		if (this.searchParams.get('m')) {
			this.$selectMonth.value = this.searchParams.get('m');
		}
		this.$table = document.querySelector('#table');

		this.$selectMonth.addEventListener('change', this._onMonthSelected.bind(this));
	}

	async render() {
		const { companyID, userID, month } = urlService.getURLParameters(window.location.href);
		const registers = await registerService.getRegisters(companyID, userID, { month });
		const totalSeconds = dataService.computeTotalSeconds(registers);

		registers.forEach(item => viewService.addItemToTable(item, this.$table));
		document.querySelector('#total').innerText = `Horas totales: ${viewService.sec2time(totalSeconds)}`;
	}

	_onMonthSelected(event) {
		this.searchParams.set('m', event.target.value);
		window.location.href = urlService.build(this.searchParams);
	}
}