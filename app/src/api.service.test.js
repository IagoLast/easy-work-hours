const require = require('esm')(module); // eslint-disable-line
const apiService = require('./api.service.js').default;


describe('api.service', () => {
	describe('.getRegisters(companyID, userID', () => {
		it('should return the data from the server as json', async () => {
			const dummyDocuments = ['dummy_doc_0', 'dummy_doc_1'];
			fetch.mockResponseOnce(JSON.stringify({ documents: dummyDocuments }));
			const actual = await apiService.getRegisters('dummy_company_id', 'dummy_user_id');

			expect(actual).toEqual(dummyDocuments);
		});

		it('should return an empty array when the server has no documents', async () => {
			const dummyDocuments = undefined;
			fetch.mockResponseOnce(JSON.stringify({ documents: dummyDocuments }));
			const actual = await apiService.getRegisters('dummy_company_id', 'dummy_user_id');

			expect(actual).toEqual([]);
		});
	});
});