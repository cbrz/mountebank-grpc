'use strict'

// constants

const PROTOCOL = 'grpc';

const LOGGING = {
    DEBUG: {
        DESCRIPTION: 'debug',
        LEVEL: 10,
    },
    INFO: {
        DESCRIPTION: 'info',
        LEVEL: 20,
    },
    WARN: {
        DESCRIPTION: 'warn',
        LEVEL: 30,
    },
    ERROR: {
        DESCRIPTION: 'error',
        LEVEL: 40,
    }
}

module.exports = { PROTOCOL, LOGGING };
