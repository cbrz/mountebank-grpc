'use strict'

// return a grpc server with the definitions/implementations populated

import { loadPackageDefinition } from '@grpc/grpc-js';
import { loadSync } from '@grpc/proto-loader';



const getClientDefinition = (serviceOptions, protobufjsOptions) => {
    protobufjsOptions = protobufjsOptions || {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
    };
    const packageDef = loadSync(serviceOptions.file, protobufjsOptions);
    let definition = loadPackageDefinition(packageDef);
    serviceOptions.service.split(".").forEach(path => {
        if (definition && path) {
            definition = definition[path];
        }
    });
    return definition;
}


const getServiceDefinition = (serviceOptions, protobufjsOptions) => {
    protobufjsOptions = protobufjsOptions || {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
    };
    const packageDef = loadSync(serviceOptions.file, protobufjsOptions);
    let definition = loadPackageDefinition(packageDef);
    serviceOptions.service.split(".").concat(["service"]).forEach(path => {
        if (definition && path) {
            definition = definition[path];
        }
    });
    return definition;
}


export default {
    getServiceDefinition,
    getClientDefinition,
}
