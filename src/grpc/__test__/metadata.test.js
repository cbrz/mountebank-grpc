const grpc = require('grpc'),
    metadata = require('../metadata');


describe('metadata module', () => {
    describe('map to metadata function', () => {
        test('converts non-binary key', () => {
            const request = { key: 'value' };
            const response = metadata.mapToMetadata(request);

            expect(response.get('key')).toEqual([request.key]);
        });

        test('converts binary key', () => {
            const request = { 'key-bin': 'value' };
            const response = metadata.mapToMetadata(request);

            expect(response.get('key-bin')).toEqual([Buffer.from(request['key-bin'])]);
        });

        test('returns on undefined request', () => {
            const request = undefined;
            const response = metadata.mapToMetadata(request);

            expect(response).toBeTruthy();
        });
    });
});