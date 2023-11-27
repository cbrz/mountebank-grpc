'use strict'

// main entry point
import { LOGGING } from './constants.js';
import { ServerCredentials } from '@grpc/grpc-js';
import mock from './mock.js';
import logging from './helpers/logging.js';
const log = logging.logger();
import * as net from 'net';


const main = () => {
    const config = JSON.parse(process.argv[2]),
        placeholder = net.createServer((sock) => { sock.end('placeholder'); });

    logging.setLogLevel(config.loglevel || LOGGING.INFO.LEVEL);

    // use placeholder server to bind port, then close -> start gRPC server with same port
    placeholder.listen(config.port || 0, () => {
        const port = placeholder.address().port;
        placeholder.close(() => {
            const serverInstance = mock.getServerInstance(Object.assign(config, {'port': port}));
            serverInstance.bindAsync(
                `0.0.0.0:${port}`,
                ServerCredentials.createInsecure(),
                () => {
                    serverInstance.start();
                });
            
            let metadata = {
                'port': port,
                'encoding': 'utf8',
                'services': config.services
            }
            console.log(JSON.stringify(metadata));
            log.info(`server started on port '%s'`, port);
        });
    });
}


main();
