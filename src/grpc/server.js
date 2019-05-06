'use strict'

// mock calls for grpc

const grpc = require('grpc'),
    metadata = require('./metadata'),
    log = require('../helpers/logging').logger();


const createRequest = () => {
    return {
        peer: undefined,
        path: undefined,
        canceled: undefined,
        value: undefined,
        metadata: undefined
    }
};


const getUnaryRequest = (call) => {
    const request = createRequest();
    request.peer = call.getPeer();
    request.canceled = call.canceled;
    request.value = call.request;
    request.metadata = call.metadata.getMap();
    return request;
};


const getStreamRequest = (call) => {
    const request = createRequest();
    request.peer = call.getPeer();
    request.canceled = call.canceled;
    request.metadata = call.metadata.getMap();
    let value = [];
    call.on('data', message => {
        value.push(message);
    });
    request.value = value;
    return request;
};


const sendUnaryResponse = (response, call, callback) => {
    const error = response.error,
        value = response.value,
        md = response.metadata;

    if (md && md.initial) {
        call.sendMetadata(metadata.mapToMetadata(md.initial));
    }

    if (error) {
        callback({
            code: grpc.status[error.status || 'INTERNAL'],
            message: error.message || 'error message'
        });
    } else {
        callback(null, value, (md && md.trailing) ? metadata.mapToMetadata(md.trailing) : undefined);
    }
};


const sendStreamResponse = (response, call) => {
    const error = response.error,
        value = response.value || [],
        md = response.metadata;

    if (md && md.initial) {
        call.sendMetadata(metadata.mapToMetadata(md.initial));
    }

    if (error) {
        call.emit('error', {
            code: grpc.status[error.status || 'INTERNAL'],
            message: error.message || 'error message'
        });
        return;
    } else {
        value.forEach(v => call.write(v));
    }
    call.end((md && md.trailing) ? metadata.mapToMetadata(md.trailing) : undefined);
};


module.exports = {
    getStreamRequest,
    getUnaryRequest,
    sendStreamResponse,
    sendUnaryResponse,
}