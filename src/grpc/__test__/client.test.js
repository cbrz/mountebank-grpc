// NOTE: Integration tests instead of unit... mocking callback + promise + events is annoying

const grpc = require('grpc'),
    client = require('../client'),
    grpcImpl = require('./grpc-impl'),
    ENDPOINT = '0.0.0.0:50051';


const createClientOptions = (method) => {
    return {
        endpoint: ENDPOINT,
        originalName: method,
        clientDefinition: grpcImpl.clientDefinition(),
    }
}


describe('integration test: client calls', () => {
    describe('positive tests', () => {
        const server = grpcImpl.successServer()

        beforeAll(() => {
            server.bind('0.0.0.0:50051', grpc.ServerCredentials.createInsecure());
            server.start();
        });

        afterAll(() => {
            server.forceShutdown();
        });

        describe('unary/unary tests', () => {
            const request = {
                value: {id: 1, data: 'request'}
            };

            test('test unary response value', async () => {
                const clientOptions = createClientOptions('exampleUnaryUnaryCall');
                const response = await client.sendUnaryUnaryCall(clientOptions, request);
                expect(response.value.id).toEqual(1);
                expect(response.value.data).toEqual('response');
            });

            test('test unary response initial metadata', async () => {
                const clientOptions = createClientOptions('exampleUnaryUnaryCall');
                const response = await client.sendUnaryUnaryCall(clientOptions, request);
                expect(response.metadata.initial).toEqual({key: 'value'});
            });

            test('test unary response trailing metadata', async () => {
                const clientOptions = createClientOptions('exampleUnaryUnaryCall');
                const response = await client.sendUnaryUnaryCall(clientOptions, request);
                expect(response.metadata.trailing).toEqual({key: 'value'});
            });
        });

        describe('unary/stream tests', () => {
            const request = {
                value: {id: 1, data: 'request'}
            };

            test('test stream response value', async () => {
                const clientOptions = createClientOptions('exampleUnaryStreamCall');
                const response = await client.sendUnaryStreamCall(clientOptions, request);
                expect(response.value[0].id).toEqual(1);
                expect(response.value[0].data).toEqual('response');
            });

            test('test unary response initial metadata', async () => {
                const clientOptions = createClientOptions('exampleUnaryStreamCall');
                const response = await client.sendUnaryStreamCall(clientOptions, request);
                expect(response.metadata.initial).toEqual({key: 'value'});
            });

            test('test unary response trailing metadata', async () => {
                const clientOptions = createClientOptions('exampleUnaryStreamCall');
                const response = await client.sendUnaryStreamCall(clientOptions, request);
                expect(response.metadata.trailing).toEqual({key: 'value'});
            });
        });

        describe('stream/unary tests', () => {
            const request = {
                value: [{id: 1, data: 'request'}]
            };

            test('test stream response value', async () => {
                const clientOptions = createClientOptions('exampleStreamUnaryCall');
                const response = await client.sendStreamUnaryCall(clientOptions, request);
                expect(response.value.id).toEqual(1);
                expect(response.value.data).toEqual('response');
            });

            test('test unary response initial metadata', async () => {
                const clientOptions = createClientOptions('exampleStreamUnaryCall');
                const response = await client.sendStreamUnaryCall(clientOptions, request);
                expect(response.metadata.initial).toEqual({key: 'value'});
            });

            test('test unary response trailing metadata', async () => {
                const clientOptions = createClientOptions('exampleStreamUnaryCall');
                const response = await client.sendStreamUnaryCall(clientOptions, request);
                expect(response.metadata.trailing).toEqual({key: 'value'});
            });
        });

        describe('stream/stream tests', () => {
            const request = {
                value: [{id: 1, data: 'request'}]
            };

            test('test stream response value', async () => {
                const clientOptions = createClientOptions('exampleStreamStreamCall');
                const response = await client.sendStreamStreamCall(clientOptions, request);
                expect(response.value[0].id).toEqual(1);
                expect(response.value[0].data).toEqual('response');
            });

            test('test unary response initial metadata', async () => {
                const clientOptions = createClientOptions('exampleStreamStreamCall');
                const response = await client.sendStreamStreamCall(clientOptions, request);
                expect(response.metadata.initial).toEqual({key: 'value'});
            });

            test('test unary response trailing metadata', async () => {
                const clientOptions = createClientOptions('exampleStreamStreamCall');
                const response = await client.sendStreamStreamCall(clientOptions, request);
                expect(response.metadata.trailing).toEqual({key: 'value'});
            });
        });
    });

    describe('negative tests', () => {
        const server = grpcImpl.errorServer()

        beforeAll(() => {
            server.bind('0.0.0.0:50051', grpc.ServerCredentials.createInsecure());
            server.start();
        });

        afterAll(() => {
            server.forceShutdown();
        });

        describe('unary/unary tests', () => {
            const request = {
                value: {id: 1, data: 'request'}
            };

            test('test unary response error', async () => {
                const clientOptions = createClientOptions('exampleUnaryUnaryCall');
                const response = await client.sendUnaryUnaryCall(clientOptions, request);
                expect(response.error.status).toEqual('INTERNAL');
                expect(response.error.message).toEqual('error message');
            });

            test('test unary response initial metadata', async () => {
                const clientOptions = createClientOptions('exampleUnaryUnaryCall');
                const response = await client.sendUnaryUnaryCall(clientOptions, request);
                expect(response.metadata.initial).toEqual({key: 'value'});
            });

            test('test unary response trailing metadata', async () => {
                const clientOptions = createClientOptions('exampleUnaryUnaryCall');
                const response = await client.sendUnaryUnaryCall(clientOptions, request);
                expect(response.metadata.trailing).toEqual({});
            });
        });


        describe('unary/stream tests', () => {
            const request = {
                value: {id: 1, data: 'request'}
            };

            test('test stream response error', async () => {
                const clientOptions = createClientOptions('exampleUnaryStreamCall');
                const response = await client.sendUnaryStreamCall(clientOptions, request);
                expect(response.error.status).toEqual('INTERNAL');
                expect(response.error.message).toEqual('error message');
            });

            test('test stream response initial metadata', async () => {
                const clientOptions = createClientOptions('exampleUnaryStreamCall');
                const response = await client.sendUnaryStreamCall(clientOptions, request);
                expect(response.metadata.initial).toEqual({key: 'value'});
            });

            test('test stream response trailing metadata', async () => {
                const clientOptions = createClientOptions('exampleUnaryStreamCall');
                const response = await client.sendUnaryStreamCall(clientOptions, request);
                expect(response.metadata.trailing).toEqual({});
            });
        });


        describe('stream/unary tests', () => {
            const request = {
                value: [{id: 1, data: 'request'}]
            };

            test('test unary response error', async () => {
                const clientOptions = createClientOptions('exampleStreamUnaryCall');
                const response = await client.sendStreamUnaryCall(clientOptions, request);
                expect(response.error.status).toEqual('INTERNAL');
                expect(response.error.message).toEqual('error message');
            });

            test('test unary response initial metadata', async () => {
                const clientOptions = createClientOptions('exampleStreamUnaryCall');
                const response = await client.sendStreamUnaryCall(clientOptions, request);
                expect(response.metadata.initial).toEqual({key: 'value'});
            });

            test('test unary response trailing metadata', async () => {
                const clientOptions = createClientOptions('exampleStreamUnaryCall');
                const response = await client.sendStreamUnaryCall(clientOptions, request);
                expect(response.metadata.trailing).toEqual({});
            });
        });


        describe('stream/stream tests', () => {
            const request = {
                value: [{id: 1, data: 'request'}]
            };

            test('test stream response error', async () => {
                const clientOptions = createClientOptions('exampleStreamStreamCall');
                const response = await client.sendStreamStreamCall(clientOptions, request);
                expect(response.error.status).toEqual('INTERNAL');
                expect(response.error.message).toEqual('error message');
            });

            test('test stream response initial metadata', async () => {
                const clientOptions = createClientOptions('exampleStreamStreamCall');
                const response = await client.sendStreamStreamCall(clientOptions, request);
                expect(response.metadata.initial).toEqual({key: 'value'});
            });

            test('test stream response trailing metadata', async () => {
                const clientOptions = createClientOptions('exampleStreamStreamCall');
                const response = await client.sendStreamStreamCall(clientOptions, request);
                expect(response.metadata.trailing).toEqual({});
            });
        });
    });

});