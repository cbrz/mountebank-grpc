const
    grpc = require('grpc'),
    mock= require('../mock');


// default implementations that shouldn't fail
const path = require('path'),
    PROTO_PATH = path.join(__dirname, '..', 'protos', 'example.proto'),
    callbackURLTemplate = ':port',
    defaultConfig = {
        callbackURLTemplate,
        port: 4545,
        loglevel: 'debug',
        allowInjection: false,
        services: [
            {
                service: 'example.ExampleService',
                file: PROTO_PATH
            }
        ]
    };


const methods = [
    { name: '/example.ExampleService/ExampleUnaryUnaryCall', type: 'unary' },
    { name: '/example.ExampleService/ExampleStreamUnaryCall', type: 'client_stream' },
    { name: '/example.ExampleService/ExampleUnaryStreamCall', type: 'server_stream' },
    { name: '/example.ExampleService/ExampleStreamStreamCall', type: 'bidi' },
]


describe('test get grpc server instance', () => {
    test('should return a non started grpc server', () => {
        const config = Object.assign({}, defaultConfig);

        const sut = mock.getServerInstance(config);
        expect(sut.started).toEqual(false);
    });

    test('should contain handlers for all methods', () => {
        const config = Object.assign({}, defaultConfig);

        const sut = mock.getServerInstance(config);
        expect(sut).toHaveProperty('handlers');
        methods.forEach(method => {
            expect(sut.handlers).toHaveProperty([method.name]);
            expect(sut.handlers).toHaveProperty([method.name, 'type'], method.type);
        });
    })
});
