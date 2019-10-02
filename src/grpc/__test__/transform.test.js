const data = require('../transform');


describe('data calls', () => {
    describe('bufferToBase64 function', () => {
        test('should return same data', () => {
            const request = {id: 1, datax: "response", common: null};
            const response = data.bufferToBase64(request);
            expect(response).toEqual(request);
        });

        test('should return buffer as base64 string', () => {
            const request = Buffer.from('test');
            const response = data.bufferToBase64(request);
            expect(response).toEqual(request.toString('base64'));
        });

        test('should return object with base64 string', () => {
            const request = {test: Buffer.from('test')};
            const response = data.bufferToBase64(request);
            expect(response).toEqual({test: request.test.toString('base64')});
        });

        test('should return array with base64 string', () => {
            const request = [Buffer.from('test'), 1, 2];
            const response = data.bufferToBase64(request);
            expect(response[0]).toEqual(request[0].toString('base64'));
            expect(response[1]).toEqual(request[1]);
            expect(response[2]).toEqual(request[2]);
        });

        test('should return complex object with base64 string', () => {
            const request = {
                nonbuf: 1,
                null: null,
                buf: Buffer.from('test'),
                arr: [Buffer.from('1'), Buffer.from('2')],
                obj: {
                    nonbuf: 1,
                    null: null,
                    buf: Buffer.from('test'),
                    arr: [Buffer.from('1'), Buffer.from('2')],
                }
            };
            const expected = {
                nonbuf: 1,
                null: null,
                buf: Buffer.from('test').toString('base64'),
                arr: [Buffer.from('1').toString('base64'), Buffer.from('2').toString('base64')],
                obj: {
                    nonbuf: 1,
                    null: null,
                    buf: Buffer.from('test').toString('base64'),
                    arr: [Buffer.from('1').toString('base64'), Buffer.from('2').toString('base64')],
                }
            }
            const response = data.bufferToBase64(request);
            expect(response).toEqual(expected);
        });

    });
});