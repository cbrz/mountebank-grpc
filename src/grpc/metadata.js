'use strict'

const grpc = require('grpc');


module.exports = {
    mapToMetadata: (map) => {
        const metadata = new grpc.Metadata();
        if (map) {
            Object.keys(map).forEach(key => {
                if (key.endsWith('-bin'))
                    metadata.add(key, Buffer.from(map[key], 'base64'));
                else
                    metadata.add(key, map[key]);
            });
        }
        return metadata;
    }
};