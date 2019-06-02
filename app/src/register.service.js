import apiService from './api.service.js';
import dataService from './data.service.js';

export async function getRegisters(companyID, userID, {month}) {
	const registers = await apiService.getRegisters(companyID, userID);
	return dataService.formatAndSort(registers, { month });
}



export default { getRegisters };