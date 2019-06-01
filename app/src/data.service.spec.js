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

    describe('formatAndSort(registers)', () => {
        it('should return a list of formatedDataElements sorted by date', () => {
            const actual = dataService.formatAndSort(registers);
            expect(actual).toEqual(_sortedDataElements);
        });
    })
});


const registers = [
    {
        "name": "projects/easyworkhours/databases/(default)/documents/registers/T6CG8FD8E/U6BHAQ6FM/0jfUx6gAWfJizXfF1ep9",
        "fields": {
            "command": {
                "stringValue": "/hi"
            },
            "date": {
                "timestampValue": "2019-06-01T08:50:00.660Z"
            }
        },
        "createTime": "2019-06-01T08:50:04.705972Z",
        "updateTime": "2019-06-01T08:50:04.705972Z"
    },
    {
        "name": "projects/easyworkhours/databases/(default)/documents/registers/T6CG8FD8E/U6BHAQ6FM/3OvLg4cKgGnABn1LGPl3",
        "fields": {
            "date": {
                "timestampValue": "2019-05-15T12:02:48.283Z"
            },
            "command": {
                "stringValue": "/bye"
            }
        },
        "createTime": "2019-05-15T12:02:48.354201Z",
        "updateTime": "2019-05-15T12:02:48.354201Z"
    },
    {
        "name": "projects/easyworkhours/databases/(default)/documents/registers/T6CG8FD8E/U6BHAQ6FM/60XXxOWGF2s0249HtS2L",
        "fields": {
            "date": {
                "timestampValue": "2019-05-15T13:31:51.313Z"
            },
            "command": {
                "stringValue": "/hi"
            }
        },
        "createTime": "2019-05-15T13:31:51.477088Z",
        "updateTime": "2019-05-15T13:31:51.477088Z"
    },
    {
        "name": "projects/easyworkhours/databases/(default)/documents/registers/T6CG8FD8E/U6BHAQ6FM/9iP8R7LaP79QR4RRcNiD",
        "fields": {
            "date": {
                "timestampValue": "2019-06-01T08:50:27.002Z"
            },
            "command": {
                "stringValue": "/hi"
            }
        },
        "createTime": "2019-06-01T08:50:27.092059Z",
        "updateTime": "2019-06-01T08:50:27.092059Z"
    },
    {
        "name": "projects/easyworkhours/databases/(default)/documents/registers/T6CG8FD8E/U6BHAQ6FM/FJ781rErlXJsRnfC7Rp1",
        "fields": {
            "date": {
                "timestampValue": "2019-05-15T12:27:20.755Z"
            },
            "command": {
                "stringValue": "/hi"
            }
        },
        "createTime": "2019-05-15T12:27:23.845476Z",
        "updateTime": "2019-05-15T12:27:23.845476Z"
    },
    {
        "name": "projects/easyworkhours/databases/(default)/documents/registers/T6CG8FD8E/U6BHAQ6FM/IvcMjNc6MolsNDjCd4qc",
        "fields": {
            "date": {
                "timestampValue": "2019-05-16T06:04:56.411Z"
            },
            "command": {
                "stringValue": "/hi"
            }
        },
        "createTime": "2019-05-16T06:04:56.488718Z",
        "updateTime": "2019-05-16T06:04:56.488718Z"
    },
    {
        "name": "projects/easyworkhours/databases/(default)/documents/registers/T6CG8FD8E/U6BHAQ6FM/LPQj5vaOYSpjDzxHTRqS",
        "fields": {
            "date": {
                "timestampValue": "2019-05-15T12:02:38.693Z"
            },
            "command": {
                "stringValue": "/hi"
            }
        },
        "createTime": "2019-05-15T12:02:41.959302Z",
        "updateTime": "2019-05-15T12:02:41.959302Z"
    },
    {
        "name": "projects/easyworkhours/databases/(default)/documents/registers/T6CG8FD8E/U6BHAQ6FM/OZRdnDUprB4gsXM6hoKM",
        "fields": {
            "date": {
                "timestampValue": "2019-05-15T12:27:26.742Z"
            },
            "command": {
                "stringValue": "/bye"
            }
        },
        "createTime": "2019-05-15T12:27:26.926670Z",
        "updateTime": "2019-05-15T12:27:26.926670Z"
    },
    {
        "name": "projects/easyworkhours/databases/(default)/documents/registers/T6CG8FD8E/U6BHAQ6FM/Pp5uKVFh9xgZv1hWXkvI",
        "fields": {
            "command": {
                "stringValue": "/hi"
            },
            "date": {
                "timestampValue": "2019-06-01T08:50:07.240Z"
            }
        },
        "createTime": "2019-06-01T08:50:07.328776Z",
        "updateTime": "2019-06-01T08:50:07.328776Z"
    },
    {
        "name": "projects/easyworkhours/databases/(default)/documents/registers/T6CG8FD8E/U6BHAQ6FM/Zd5nyG5YHo5pyC4lvAjl",
        "fields": {
            "date": {
                "timestampValue": "2019-05-16T06:04:50.472Z"
            },
            "command": {
                "stringValue": "/hi"
            }
        },
        "createTime": "2019-05-16T06:04:53.383761Z",
        "updateTime": "2019-05-16T06:04:53.383761Z"
    },
    {
        "name": "projects/easyworkhours/databases/(default)/documents/registers/T6CG8FD8E/U6BHAQ6FM/fx2hdwcWiMysp932HT0k",
        "fields": {
            "date": {
                "timestampValue": "2019-05-15T12:19:30.856Z"
            },
            "command": {
                "stringValue": "/hi"
            }
        },
        "createTime": "2019-05-15T12:19:34.050200Z",
        "updateTime": "2019-05-15T12:19:34.050200Z"
    },
    {
        "name": "projects/easyworkhours/databases/(default)/documents/registers/T6CG8FD8E/U6BHAQ6FM/g5zv3YprZwjffX2NWJiX",
        "fields": {
            "date": {
                "timestampValue": "2019-05-16T08:15:56.856Z"
            },
            "command": {
                "stringValue": "/hi"
            }
        },
        "createTime": "2019-05-16T08:15:57.028914Z",
        "updateTime": "2019-05-16T08:15:57.028914Z"
    },
    {
        "name": "projects/easyworkhours/databases/(default)/documents/registers/T6CG8FD8E/U6BHAQ6FM/iJBIHxLDopmK6u1o0yQW",
        "fields": {
            "command": {
                "stringValue": "/bye"
            },
            "date": {
                "timestampValue": "2019-05-16T08:16:02.705Z"
            }
        },
        "createTime": "2019-05-16T08:16:02.812976Z",
        "updateTime": "2019-05-16T08:16:02.812976Z"
    },
    {
        "name": "projects/easyworkhours/databases/(default)/documents/registers/T6CG8FD8E/U6BHAQ6FM/lYIdwZUwpqoMmgPpVH5l",
        "fields": {
            "date": {
                "timestampValue": "2019-06-01T08:50:22.507Z"
            },
            "command": {
                "stringValue": "/bye"
            }
        },
        "createTime": "2019-06-01T08:50:22.590851Z",
        "updateTime": "2019-06-01T08:50:22.590851Z"
    },
    {
        "name": "projects/easyworkhours/databases/(default)/documents/registers/T6CG8FD8E/U6BHAQ6FM/pkjjAwtPMD0aK5RG6Ffw",
        "fields": {
            "command": {
                "stringValue": "/bye"
            },
            "date": {
                "timestampValue": "2019-05-15T15:22:21.941Z"
            }
        },
        "createTime": "2019-05-15T15:22:22.123890Z",
        "updateTime": "2019-05-15T15:22:22.123890Z"
    }
];

const _sortedDataElements = [
    {
        "key": "2019/5/15",
        "date": new Date("2019-05-14T22:00:00.000Z"),
        "register": [
            {
                "action": "SIGN_IN",
                "date": new Date("2019-05-15T12:02:38.693Z"),
            },
            {
                "action": "SIGN_OUT",
                "date": new Date("2019-05-15T12:02:48.283Z"),
            },
            {
                "action": "SIGN_IN",
                "date": new Date("2019-05-15T12:19:30.856Z"),
            },
            {
                "action": "SIGN_IN",
                "date": new Date("2019-05-15T12:27:20.755Z"),
            },
            {
                "action": "SIGN_OUT",
                "date": new Date("2019-05-15T12:27:26.742Z"),
            },
            {
                "action": "SIGN_IN",
                "date": new Date("2019-05-15T13:31:51.313Z"),
            },
            {
                "action": "SIGN_OUT",
                "date": new Date("2019-05-15T15:22:21.941Z"),
            }
        ],
        "seconds": 7116.104
    },
    {
        "key": "2019/5/16",
        "date": new Date("2019-05-15T22:00:00.000Z"),
        "register": [
            {
                "action": "SIGN_IN",
                "date": new Date("2019-05-16T06:04:50.472Z"),
            },
            {
                "action": "SIGN_IN",
                "date": new Date("2019-05-16T06:04:56.411Z"),
            },
            {
                "action": "SIGN_IN",
                "date": new Date("2019-05-16T08:15:56.856Z"),
            },
            {
                "action": "SIGN_OUT",
                "date": new Date("2019-05-16T08:16:02.705Z"),
            }
        ],
        "seconds": 7872.233
    },
    {
        "key": "2019/6/1",
        "date": new Date("2019-05-31T22:00:00.000Z"),
        "register": [
            {
                "action": "SIGN_IN",
                "date": new Date("2019-06-01T08:50:00.660Z"),
            },
            {
                "action": "SIGN_IN",
                "date": new Date("2019-06-01T08:50:07.240Z"),
            },
            {
                "action": "SIGN_OUT",
                "date": new Date("2019-06-01T08:50:22.507Z"),
            },
            {
                "action": "SIGN_IN",
                "date": new Date("2019-06-01T08:50:27.002Z"),
            }
        ],
        "seconds": 21.847
    }
];