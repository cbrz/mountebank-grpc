'use strict'

import { ServerCredentials, StatusBuilder as _status } from '@grpc/grpc-js';
import { bufferToBase64 } from './transform.js';
import { mapToMetadata } from './metadata.js';
import logging from '../helpers/logging.js'
const log = logging.logger();


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
            clientOptions.endpoint, ServerCredentials.createInsecure()
        ),
        md = getRequestMetadata(request),
        response = createResponse();
    return new Promise((resolve) => {
        const call = client[clientOptions.originalName](
            request.value,
            mapToMetadata(md.initial),
            (error, data) => handleUnaryData(error, data, response)
        );
        call.on('metadata', (metadata) => handleMetadata(metadata, response));
        call.on('status', (status) => handleStatus(status, response, resolve));
    });
};


const sendUnaryStreamCall = (clientOptions, request) => {
    const client = new clientOptions.clientDefinition(
            clientOptions.endpoint, credentials.createInsecure()
        ),
        md = getRequestMetadata(request),
        response = createResponse();
    return new Promise((resolve) => {
        const call = client[clientOptions.originalName](request.value, mapToMetadata(md.initial));
        call.on('data', (data) => handleStreamData(data, response));
        call.on('error', (error) => handleError(error, response));
        call.on('metadata', (metadata) => handleMetadata(metadata, response));
        call.on('status', (status) => handleStatus(status, response, resolve));
    });
};


const sendStreamUnaryCall = (clientOptions, request) => {
    const client = new clientOptions.clientDefinition(
            clientOptions.endpoint, credentials.createInsecure()
        ),
        md = getRequestMetadata(request),
        response = createResponse();
    return new Promise((resolve) => {
        const call = client[clientOptions.originalName](
            mapToMetadata(md.initial),
            (error, data) => handleUnaryData(error, data, response)
        );
        call.on('metadata', (metadata) => handleMetadata(metadata, response));
        call.on('status', (status) => handleStatus(status, response, resolve));
        request.value.forEach(v => call.write(v));
        call.end(mapToMetadata(md.trailing));
    });
};


const sendStreamStreamCall = (clientOptions, request) => {
    const client = new clientOptions.clientDefinition(
            clientOptions.endpoint, credentials.createInsecure()
        ),
        md = getRequestMetadata(request),
        response = createResponse();
    return new Promise((resolve) => {
        const call = client[clientOptions.originalName](request.value, mapToMetadata(md.initial));
        call.on('data', (data) => handleStreamData(data, response));
        call.on('error', (error) => handleError(error, response));
        call.on('metadata', (metadata) => handleMetadata(metadata, response));
        call.on('status', (status) => handleStatus(status, response, resolve));
        request.value.forEach(v => call.write(v));
        call.end(mapToMetadata(md.trailing));
    });
};


const getRequestMetadata = (request) => {
    return {
        initial: request.metadata && request.metadata.initial ? request.metadata.initial : {},
        trailing: request.metadata && request.metadata.trailing ? request.metadata.trailing : {},
    }
}


const handleUnaryData = (error, data, response) => {
    if (error) {
        log.debug("error='%s'", JSON.stringify(error));
        response.error = {
            status: Object.keys(_status)[error.code],
            message: error.details
        }
    }
    log.debug('data="%s"', JSON.stringify(data));
    response.value = bufferToBase64(data);
};


const handleStreamData = (data, response) => {
    log.debug("data='%s'", JSON.stringify(data));
    if (!response.value) response.value = [];
    response.value.push(bufferToBase64(data));
};


const handleError = (error, response) => {
    log.debug("error='%s'", JSON.stringify(error));
    response.error = {
        status: Object.keys(_status)[error.code],
        message: error.details
    }
}


const handleMetadata = (metadata, response) => {
    log.debug("metadata='%s'", JSON.stringify(metadata));
    response.metadata.initial = bufferToBase64(metadata.getMap());
};


const handleStatus = (status, response, resolve) => {
    log.debug("status='%s'", JSON.stringify(status));
    response.metadata.trailing = bufferToBase64(status.metadata.getMap());
    resolve(response);
};


export default {
    sendUnaryUnaryCall,
    sendUnaryStreamCall,
    sendStreamUnaryCall,
    sendStreamStreamCall,
}