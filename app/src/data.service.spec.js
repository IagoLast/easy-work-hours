require = require('esm')(module); // eslint-disable-line
const dataService = require('./data.service').default;


describe('data.service', () => {
    describe('.transform(rawDataElements)', () => {
        it('should transform the document properly', () => {
            const dummyElements = [
                {
                    name: "projects/proyecto-generico-205719/databases/(default)/documents/T6CG8FD8E/U6BHAQ6FM/data/EYdoN8Y1uJDFF1xxHFmb",
                    fields: {
                        command: {
                            stringValue: "/hi"
                        },
                        date: {
                            timestampValue: "2019-05-10T17:26:46.161Z"
                        }
                    },
                    createTime: "2019-05-10T17:26:46.300695Z",
                    updateTime: "2019-05-10T17:26:46.300695Z"
                },
                {
                    name: "projects/proyecto-generico-205719/databases/(default)/documents/T6CG8FD8E/U6BHAQ6FM/data/EYdoN8Y1uJDFF1xxHFmb",
                    fields: {
                        command: {
                            stringValue: "/bye"
                        },
                        date: {
                            timestampValue: "2019-05-10T17:26:46.161Z"
                        }
                    },
                    createTime: "2019-05-10T17:26:46.300695Z",
                    updateTime: "2019-05-10T17:26:46.300695Z"
                }];

            const actual = dataService.transform(dummyElements);
            expect(actual).toEqual([
                {
                    action: 'SIGN_IN',
                    date: new Date('2019-05-10T17:26:46.161Z'),
                },
                {
                    action: 'SIGN_OUT',
                    date: new Date('2019-05-10T17:26:46.161Z'),
                }
            ]);
        });
    });

    describe('.getDays(entries)', () => {
        it('should return the right value when the user logs in and logs out', () => {
            const dummyEntries = [
                { action: 'SIGN_IN', date: new Date(2019, 5, 11, 8) },
                { action: 'SIGN_OUT', date: new Date(2019, 5, 11, 16) },
            ];

            const actual = dataService.getDays(dummyEntries);
            expect(actual).toEqual({
                '2019/6/11': {
                    seconds: 28800,
                    register: dummyEntries,
                }
            });
        });

        it('should return the right value when the user logs in and logs out', () => {
            const dummyEntries = [
                { action: 'SIGN_IN', date: new Date(2019, 5, 11, 8) },
                { action: 'SIGN_OUT', date: new Date(2019, 5, 11, 13) },
                { action: 'SIGN_IN', date: new Date(2019, 5, 11, 14) },
                { action: 'SIGN_OUT', date: new Date(2019, 5, 11, 17) },
            ];

            const actual = dataService.getDays(dummyEntries);
            expect(actual).toEqual({
                '2019/6/11': {
                    seconds: 28800,
                    register: dummyEntries,
                }
            });
        });

        it('should ignore the second sign_in when the user signs in twice ', () => {
            const dummyEntries = [
                { action: 'SIGN_IN', date: new Date(2019, 5, 14, 8) },
                { action: 'SIGN_IN', date: new Date(2019, 5, 14, 9) },
                { action: 'SIGN_OUT', date: new Date(2019, 5, 14, 16) },
            ];

            const actual = dataService.getDays(dummyEntries);
            expect(actual).toEqual({
                '2019/6/14': {
                    seconds: 28800,
                    register: dummyEntries,
                }
            });
        });

        it('should ignore the second sign_out when the user signs outs twice ', () => {
            const dummyEntries = [
                { action: 'SIGN_IN', date: new Date(2019, 5, 14, 8) },
                { action: 'SIGN_OUT', date: new Date(2019, 5, 14, 16) },
                { action: 'SIGN_OUT', date: new Date(2019, 5, 14, 17) },

            ];

            const actual = dataService.getDays(dummyEntries);
            expect(actual).toEqual({
                '2019/6/14': {
                    seconds: 28800,
                    register: dummyEntries,
                }
            });
        });

        it('should return the right value when the user signs multiple times ', () => {
            const dummyEntries = [
                { action: 'SIGN_IN', date: new Date(2019, 5, 14, 8) },
                { action: 'SIGN_IN', date: new Date(2019, 5, 14, 9, 30) },

                { action: 'SIGN_OUT', date: new Date(2019, 5, 14, 13) },
                { action: 'SIGN_IN', date: new Date(2019, 5, 14, 14) },
                { action: 'SIGN_IN', date: new Date(2019, 5, 14, 14, 30) },

                { action: 'SIGN_OUT', date: new Date(2019, 5, 14, 17) },
                { action: 'SIGN_OUT', date: new Date(2019, 5, 14, 19) },
            ];

            const actual = dataService.getDays(dummyEntries);
            expect(actual).toEqual({
                '2019/6/14': {
                    seconds: 28800,
                    register: dummyEntries,
                }
            });

        });

        it('should return 0 when there is no sign_out', () => {
            const dummyEntries = [
                { action: 'SIGN_IN', date: new Date(2019, 5, 14, 8) },
            ];

            const actual = dataService.getDays(dummyEntries);
            expect(actual).toEqual({
                '2019/6/14': {
                    seconds: 0,
                    register: dummyEntries,
                }
            });
        });

        it('should return 0 when there is no sign_in', () => {
            const dummyEntries = [
                { action: 'SIGN_OUT', date: new Date(2019, 5, 14, 8) },
            ];

            const actual = dataService.getDays(dummyEntries);
            expect(actual).toEqual({
                '2019/6/14': {
                    seconds: 0,
                    register: dummyEntries,
                }
            });
        });

        it('should return 0 when sign_in after sign_out', () => {
            const dummyEntries = [
                { action: 'SIGN_OUT', date: new Date(2019, 5, 14, 8) },
                { action: 'SIGN_IN', date: new Date(2019, 5, 14, 18) },
            ];

            const actual = dataService.getDays(dummyEntries);
            expect(actual).toEqual({
                '2019/6/14': {
                    seconds: 0,
                    register: dummyEntries,
                }
            });
        });
    })
});