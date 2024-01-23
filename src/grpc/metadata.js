'use strict'

import { Metadata } from '@grpc/grpc-js';


export function mapToMetadata(map) {
    const metadata = new Metadata();
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