'use strict'

// main entry point
const
    constants = require('./constants'),
    detectport = require('detect-port'),
    grpc = require('grpc'),
    mock = require('./mock'),
    logging = require('./helpers/logging'),
    log = logging.logger();


const main = () => {
    const config = JSON.parse(process.argv[2]);
    logging.setLogLevel(config.loglevel || constants.LOGGING.INFO.LEVEL);


    const serverInstance = mock.getServerInstance(config);

    // hack due to grpc using SO_REUSEADDR/SO_REUSEPORT and the option not working when calling grpc server
    // we don't want to add another grpc server to the same port since they can have different mocks setup which can throw off mountebank
    detectport(config.port, function (err, port) {
        if (config.port === port) {
            serverInstance.bind(
                '0.0.0.0' + ':' + (config.port || 50051),
                grpc.ServerCredentials.createInsecure()
            );
            serverInstance.start();
            log.info(`server started on port '%s'`, config.port);
        } else {
            console.error(`cannot start server on port '%s'!`, config.port);
            process.exit(1);
        }
    });
}


main();
