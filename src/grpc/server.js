'use strict'

// mock calls for grpc

const grpc = require('grpc'),
    transform = require('./transform'),
    metadata = require('./metadata');


const createRequest = () => {
    return {
        peer: undefined,
        path: undefined,
        canceled: undefined,
        value: undefined,
        metadata: {
            initial: undefined,
            trailing: undefined
        }
    }
};


const getUnaryRequest = (call) => {
    const t = (d) => transform.bufferToBase64(d);
    const request = createRequest();
    request.peer = call.getPeer();
    request.canceled = call.canceled;
    request.value = t(call.request);
    request.metadata.initial = t(call.metadata.getMap());
    call.on('status', status => {
        request.metadata.trailing = t(status.metadata.getMap())
    });
    return request;
};


const getStreamRequest = (call) => {
    const t = (d) => transform.bufferToBase64(d);
    const request = createRequest();
    request.peer = call.getPeer();
    request.canceled = call.canceled;
    request.metadata.initial = t(call.metadata.getMap());
    let value = [];
    call.on('data', message => {
        value.push(message);
    });
    request.value = t(value);
    call.on('status', status => {
        request.metadata.trailing = t(status.metadata.getMap())
    });
    return request;
};


const sendUnaryResponse = (response, call, callback) => {
    const t = (d) => transform.bufferToBase64(d);
    const error = t(response.error),
        value = t(response.value),
        md = t(response.metadata);

    if (md && md.initial) {
        call.sendMetadata(metadata.mapToMetadata(md.initial));
    }

    if (error) {
        callback({
            code: grpc.status[error.status || 'INTERNAL'],
            message: error.message || 'error message',
            metadata: (md && md.trailing) ? metadata.mapToMetadata(md.trailing) : undefined
        });
    } else {
        callback(null, value, (md && md.trailing) ? metadata.mapToMetadata(md.trailing) : undefined);
    }
};


const sendStreamResponse = (response, call) => {
    const t = (d) => transform.bufferToBase64(d);
    const error = t(response.error),
        value = t(response.value) || [],
        md = t(response.metadata);

    if (md && md.initial) {
        call.sendMetadata(metadata.mapToMetadata(md.initial));
    }

    if (error) {
        call.emit('error', {
            code: grpc.status[error.status || 'INTERNAL'],
            message: error.message || 'error message',
            metadata: (md && md.trailing) ? metadata.mapToMetadata(md.trailing) : undefined
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