'use strict'

// return a grpc server with the definitions/implementations populated

const
    grpc = require('grpc'),
    protoLoader = require('@grpc/proto-loader'),
    log = require('../helpers/logging').logger();



const getClientDefinition = (serviceOptions, protobufjsOptions) => {
    log.info("get service definition");
    protobufjsOptions = protobufjsOptions || {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
    };
    const packageDef = protoLoader.loadSync(serviceOptions.file, protobufjsOptions);
    let definition = grpc.loadPackageDefinition(packageDef);
    serviceOptions.service.split(".").forEach(path => {
        if (path == undefined) return undefined;
        definition = definition[path];
    });
    return definition;
}


const getServiceDefinition = (serviceOptions, protobufjsOptions) => {
    log.info("get service definition");
    protobufjsOptions = protobufjsOptions || {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
    };
    const packageDef = protoLoader.loadSync(serviceOptions.file, protobufjsOptions);
    let definition = grpc.loadPackageDefinition(packageDef);
    serviceOptions.service.split(".").concat(["service"]).forEach(path => {
        if (path == undefined) return undefined;
        definition = definition[path];
    });
    return definition;
}


module.exports = {
    getServiceDefinition,
    getClientDefinition,
}
