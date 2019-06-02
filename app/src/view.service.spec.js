import viewService from './view.service.js';

describe('viewService', () => {
	describe('.addItemToTable()', () => {
		it('should add an item to a table', () => {
			const $table = document.createElement('table');

			const actual = viewService.addItemToTable(dummyItem, $table).innerHTML.replace(/\s/g, '');

			expect(actual).toBe(expected);
		});
	});
});


const dummyItem = {
	'key': '2019/6/1',
	'date': new Date('2019-05-31T22:00:00.000Z',),
	'register': [
		{
			'action': 'SIGN_IN',
			'date': new Date('2019-06-01T08:50:00.660Z'),
		},
		{
			'action': 'SIGN_IN',
			'date': new Date('2019-06-01T08:50:07.240Z'),
		},
		{
			'action': 'SIGN_OUT',
			'date': new Date('2019-06-01T08:50:22.507Z'),
		},
		{
			'action': 'SIGN_IN',
			'date': new Date('2019-06-01T08:50:27.002Z'),
		},
		{
			'action': 'SIGN_OUT',
			'date': new Date('2019-06-01T11:02:35.095Z'),
		}
	],
	'seconds': 7949.94
};

const expected = '<tr><td>2019/6/1</td><td><p>10:50-Entrada</p><p>10:50-Entrada</p><p>10:50-Salida</p><p>10:50-Entrada</p><p>13:02-Salida</p></td><td>02:12</td></tr>';