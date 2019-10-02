const
    events = require('events'),
    server = require('../server');


describe('server calls', () => {
    describe('get unary request', () => {
        const call = new events.EventEmitter();
        call.getPeer = jest.fn(() => 'peer');
        call.metadata = {
            getMap: jest.fn(() => {})
        };

        test('gets unary request from call', () => {
            const response = server.getUnaryRequest(call);

            expect(response.value).toEqual(call.request);
        });
    });


    describe('get stream request', () => {
        const call = new events.EventEmitter();
        call.getPeer = jest.fn(() => 'peer');
        call.metadata = {
            getMap: jest.fn(() => {})
        };

        test('gets stream request from call', () => {
            const request = ['data', 'data']
            const response = server.getStreamRequest(call);
            request.forEach(x => call.emit('data', x));

            expect(response.value).toEqual(request);
        });
    });


    describe('send unary response', () => {
        const call = {
                sendMetadata: jest.fn(() => true)
            },
            callback = jest.fn((x, y, z) => {x, y, z});
        
        test('sends initial metadata', () => {
            const request = {
                value: 'data',
                metadata: {
                    initial: {key: 'value'}
                }
            };
            server.sendUnaryResponse(request, call, callback);

            expect(call.sendMetadata.mock.calls.length).toBe(1);
            expect(call.sendMetadata.mock.calls[0]).toBeDefined();
        });

        test('sends unary error', () => {
            const expected = {
                    code: 13,
                    message: 'error message'
                },
                request = {
                    error: {
                        status: 'INTERNAL',
                        message: expected.message
                    },
                    value: 'data',
                };
            server.sendUnaryResponse(request, call, callback);

            expect(callback.mock.calls.length).toBe(1);
            expect(callback.mock.calls[0][0]).toEqual(expected);
        });

        test('sends unary value', () => {
            const expected = 'data',
                request = {
                    value: 'data',
                };
            server.sendUnaryResponse(request, call, callback);

            expect(callback.mock.calls.length).toBe(1);
            expect(callback.mock.calls[0][1]).toEqual(expected);
        });

        test('sends trailing metadata', () => {
            const request = {
                value: 'data',
                metadata: {
                    trailing: {key: 'value'}
                }
            };
            server.sendUnaryResponse(request, call, callback);

            expect(callback.mock.calls.length).toBe(1);
            expect(callback.mock.calls[0][2]).toBeDefined();
        });
    });

    describe('send stream response', () => {
        const call = {
            sendMetadata: jest.fn(() => true),
            emit: jest.fn(() => true),
            write: jest.fn(() => true),
            end: jest.fn(() => true)
        };

        test('sends initial metadata', () => {
            const request = {
                metadata: {
                    initial: {key: 'value'}
                }
            };
            server.sendStreamResponse(request, call);

            expect(call.sendMetadata.mock.calls.length).toBe(1);
            expect(call.sendMetadata.mock.calls[0]).toBeDefined();
        });

        test('sends stream error', () => {
            const expected = {
                    code: 13,
                    message: 'error message'
                },
                request = {
                    error: {
                        status: 'INTERNAL',
                        message: expected.message
                    }
                };
            server.sendStreamResponse(request, call);

            expect(call.emit.mock.calls.length).toBe(1);
        });

        test('sends stream value', () => {
            const expected = ['data_a', 'data_b'],
                request = {
                    value: expected,
                };
            server.sendStreamResponse(request, call);

            expect(call.write.mock.calls.length).toBe(2);
            expect(call.write.mock.calls[0][0]).toEqual(expected[0]);
            expect(call.write.mock.calls[1][0]).toEqual(expected[1]);
        });

        test('sends trailing metadata', () => {
            const request = {
                metadata: {
                    trailing: {key: 'value'}
                }
            };
            server.sendStreamResponse(request, call);

            expect(call.end.mock.calls.length).toBe(1);
            expect(call.end.mock.calls[0][0]).toBeDefined();
        });
    });
});