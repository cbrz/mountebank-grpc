'use strict'

const
    grpc = require('grpc'),
    service = require('../service'),
    PROTO_PATH = __dirname + '../../../protos/example.proto';


const clientDefinition = () => {
    console.log(PROTO_PATH)
    return service.getClientDefinition({
        file: PROTO_PATH,
        service: 'example.ExampleService'
    });
}


const successServer = () => {
    const server = new grpc.Server();
    const serviceDefinition = service.getServiceDefinition({
        file: PROTO_PATH,
        service: 'example.ExampleService'
    });
    server.addService(serviceDefinition, {
        exampleUnaryUnaryCall: successUnary,
        exampleUnaryStreamCall: successStream,
        exampleStreamUnaryCall: successUnary,
        exampleStreamStreamCall: successStream,
    });
    return server;
};


const successUnary = ((call, callback) => {
    const data = {
            id: 1,
            data: 'response'
        },
        metadata = new grpc.Metadata();
    metadata.add('key', 'value');

    call.sendMetadata(metadata);
    callback(null, data, metadata);
});


const successStream = (call => {
    const data = {
            id: 1,
            data: 'response'
        },
        metadata = new grpc.Metadata();
    metadata.add('key', 'value');

    call.sendMetadata(metadata);
    call.write(data);
    call.end(metadata);
});


const errorServer = () => {
    const server = new grpc.Server();
    const serviceDefinition = service.getServiceDefinition({
        file: PROTO_PATH,
        service: 'example.ExampleService'
    });
    server.addService(serviceDefinition, {
        exampleUnaryUnaryCall: errorUnary,
        exampleUnaryStreamCall: errorStream,
        exampleStreamUnaryCall: errorUnary,
        exampleStreamStreamCall: errorStream,
    });
    return server;
};


const errorUnary = ((call, callback) => {
    const error = {
            code: grpc.status['INTERNAL'],
            message: 'error message'
        },
        metadata = new grpc.Metadata();
    metadata.add('key', 'value');

    call.sendMetadata(metadata);
    callback(error);
});


const errorStream = ((call) => {
    const error = {
            code: grpc.status['INTERNAL'],
            message: 'error message'
        },
        metadata = new grpc.Metadata();
    metadata.add('key', 'value');

    call.sendMetadata(metadata);
    call.emit('error', error);
});


module.exports = {
    clientDefinition,
    successServer,
    errorServer,
}