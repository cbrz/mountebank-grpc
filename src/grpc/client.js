'use strict'

const grpc = require('grpc'),
    metadata = require('./metadata');


const createResponse = () => {
    return {
        error: undefined,
        value: undefined,
        metadata: {
            initial: undefined,
            trailing: undefined
        }
    };
}


const sendUnaryUnaryCall = (clientOptions, request) => {
    const client = new clientOptions.clientDefinition(
            clientOptions.endpoint, grpc.credentials.createInsecure()
        ),
        response = createResponse();
    return new Promise((resolve) => {
        const call = client[clientOptions.originalName](
            metadata.mapToMetadata(request.metadata),
            (error, data) => handleUnaryData(error, data, response)
        );
        call.on('metadata', (metadata) => handleMetadata(metadata, response));
        call.on('status', (status) => handleStatus(status, response, resolve));
    });
};


const sendUnaryStreamCall = (clientOptions, request) => {
    const client = new clientOptions.clientDefinition(
            clientOptions.endpoint, grpc.credentials.createInsecure()
        ),
        response = createResponse();
    return new Promise((resolve) => {
        const call = client[clientOptions.originalName](request.value, metadata.mapToMetadata(request.metadata));
        call.on('data', (data) => handleStreamData(data, response));
        call.on('error', (error) => handleError(error, response));
        call.on('metadata', (metadata) => handleMetadata(metadata, response));
        call.on('status', (status) => handleStatus(status, response, resolve));
    });
};


const sendStreamUnaryCall = (clientOptions, request) => {
    const client = new clientOptions.clientDefinition(
            clientOptions.endpoint, grpc.credentials.createInsecure()
        ),
        response = createResponse();
    return new Promise((resolve) => {
        const call = client[clientOptions.originalName](
            metadata.mapToMetadata(request.metadata),
            (error, data) => handleUnaryData(error, data, response)
        );
        call.on('metadata', (metadata) => handleMetadata(metadata, response));
        call.on('status', (status) => handleStatus(status, response, resolve));
        request.value.forEach(v => call.write(v));
        call.end();
    });
};


const sendStreamStreamCall = (clientOptions, request) => {
    const client = new clientOptions.clientDefinition(
            clientOptions.endpoint, grpc.credentials.createInsecure()
        ),
        response = createResponse();
    return new Promise((resolve) => {
        const call = client[clientOptions.originalName](request.value, metadata.mapToMetadata(request.metadata));
        call.on('data', (data) => handleStreamData(data, response));
        call.on('error', (error) => handleError(error, response));
        call.on('metadata', (metadata) => handleMetadata(metadata, response));
        call.on('status', (status) => handleStatus(status, response, resolve));
        request.value.forEach(v => call.write(v));
        call.end();
    });
};


const handleUnaryData = (error, data, response) => {
    if (error) {
        console.log('debug', 'error', JSON.stringify(error));
        response.error = {
            status: Object.keys(grpc.status)[error.code],
            message: error.details
        }
    };
    console.log('debug', 'data', JSON.stringify(data));
    response.value = data;
};


const handleStreamData = (data, response) => {
    console.log('debug', 'data', JSON.stringify(data));
    if (!response.value) response.value = [];
    response.value.push(data);
};


const handleError = (error, response) => {
    console.log('debug', 'error', JSON.stringify(error));
        response.error = {
            status: Object.keys(grpc.status)[error.code],
            message: error.details
        }
}


const handleMetadata = (metadata, response) => {
    console.log('debug', 'metadata', JSON.stringify(metadata));
    response.metadata.initial = metadata.getMap();
};


const handleStatus = (status, response, resolve) => {
    console.log('debug', 'status', JSON.stringify(status));
    response.metadata.trailing = status.metadata.getMap();
    resolve(response);
};


module.exports = {
    sendUnaryUnaryCall,
    sendUnaryStreamCall,
    sendStreamUnaryCall,
    sendStreamStreamCall,
}