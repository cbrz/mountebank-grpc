'use strict'

import { sprintf } from 'sprintf-js';
import { LOGGING } from '../constants.js';


let loglevel = LOGGING.DEBUG.LEVEL


const setLogLevel = (level) => {
    if (level && level.toUpperCase() in LOGGING) {
        loglevel = LOGGING[level.toUpperCase()].LEVEL;
    }
}


const instance = {
    debug: (...msg) => {
        if (loglevel <= LOGGING.DEBUG.LEVEL) {
            console.log(formatMessage(LOGGING.DEBUG.DESCRIPTION, ...msg));
        }
    },
    info: (...msg) => {
        if (loglevel <= LOGGING.INFO.LEVEL) {
            console.log(formatMessage(LOGGING.INFO.DESCRIPTION, ...msg));
        }
    },
    warn: (...msg) => {
        if (loglevel <= LOGGING.WARN.LEVEL) {
            console.log(formatMessage(LOGGING.WARN.DESCRIPTION, ...msg));
        }
    },
    error: (...msg) => {
        if (loglevel <= LOGGING.ERROR.LEVEL) {
            console.log(formatMessage(LOGGING.ERROR.DESCRIPTION, ...msg));
        }
    }
}


const logger = () => {
    return instance;
}


const timestamp = () => `${new Date().toISOString()}`


const formatMessage = (level, ...msg) => {
    return `${level} [${timestamp()}] ${sprintf(...msg)}`
}

export default { logger, setLogLevel }
