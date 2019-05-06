jest.mock('grpc');
jest.mock('@grpc/proto-loader');

const
    grpc = require('grpc'),
    protoLoader = require('@grpc/proto-loader'),
    service = require('../service.js'),
    options = {
        service: 'example.ExampleService',
        file: '/path/to/myfile'
    },
    definition = {
        example: {
            ExampleService: {
                service: 'myservice'
            }
        }
    };


// default mocks
protoLoader.loadSync.mockImplementation(() => 'package');
grpc.loadPackageDefinition.mockImplementation(() => definition);


describe('get client definition', () => {
    test('calls protoLoader.loadSync', () => {
        service.getClientDefinition(options);

        expect(protoLoader.loadSync.mock.calls.length).toBe(1);
        expect(protoLoader.loadSync.mock.calls[0][0]).toEqual(options.file);
    });

    test('calls grpc.loadPackageDefinition', () => {
        service.getClientDefinition(options);

        expect(grpc.loadPackageDefinition.mock.calls.length).toBe(1);
        expect(grpc.loadPackageDefinition.mock.calls[0][0]).toEqual('package');
    });

    test('returns client definition', () => {
        const response = service.getClientDefinition(options);

        expect(response).toEqual(definition.example.ExampleService);
    });
});


describe('get service definition', () => {
    test('calls protoLoader.loadSync', () => {
        service.getServiceDefinition(options);

        expect(protoLoader.loadSync.mock.calls.length).toBe(1);
        expect(protoLoader.loadSync.mock.calls[0][0]).toEqual(options.file);
    });

    test('calls grpc.loadPackageDefinition', () => {
        service.getServiceDefinition(options);

        expect(grpc.loadPackageDefinition.mock.calls.length).toBe(1);
        expect(grpc.loadPackageDefinition.mock.calls[0][0]).toEqual('package');
    });

    test('returns client definition', () => {
        const response = service.getServiceDefinition(options);

        expect(response).toEqual(definition.example.ExampleService.service);
    });
});
