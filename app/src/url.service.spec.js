import urlService from './url.service.js';

describe('urlService', () => {
	describe('.getURLParameters(href)', () => {
		it('should throw an error when there is no q parameter', () => {
			const dummyURL = 'https://easyworkhours.web.app';

			expect(() => {
				urlService.getURLParameters(dummyURL);
			}).toThrow();
		});
        
		it('should throw an error when the query is invalid', () => {
			const dummyURL = 'https://easyworkhours.web.app?q=invalid_query';

			expect(() => {
				urlService.getURLParameters(dummyURL);
			}).toThrow();
		});
        
		it('should throw an error when m is not a valid month', () => {
			const dummyURL = 'https://easyworkhours.web.app?q=VDZDRzhGRDhFOlU2QkhBUTZGTQ%3D%3D&m=invalid_month';

			expect(() => {
				urlService.getURLParameters(dummyURL);
			}).toThrow();
		});
        
		it('should extract the parameters from the url', () => {
			const dummyURL = 'https://easyworkhours.web.app?q=VDZDRzhGRDhFOlU2QkhBUTZGTQ%3D%3D&m=5';
			const actual = urlService.getURLParameters(dummyURL);
			expect(actual).toEqual({
				companyID: 'T6CG8FD8E',
				userID: 'U6BHAQ6FM',
				month: 5,
			});
		});


	});
    
	describe('.build(href)', () => {
		it('should build a new url with the given search parameters', () => {
			const dummySearchParams = new URLSearchParams('foo=1&bar=dummy');

			const actual = urlService.build(dummySearchParams);

			expect(actual).toEqual('http://localhost/?foo=1&bar=dummy');
		});
	});
});