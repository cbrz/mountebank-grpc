'use strict'

const
    sprintfJs = require('sprintf-js'),
    constants = require('../constants');


let loglevel = constants.LOGGING.DEBUG.LEVEL


const setLogLevel = (level) => {
    if (level && level.toUpperCase() in constants.LOGGING) {
        loglevel = constants.LOGGING[level.toUpperCase()].LEVEL;
    }
}


const instance = {
    debug: (...msg) => {
        if (loglevel <= constants.LOGGING.DEBUG.LEVEL) {
            console.log(formatMessage(constants.LOGGING.DEBUG.DESCRIPTION, ...msg));
        }
    },
    info: (...msg) => {
        if (loglevel <= constants.LOGGING.INFO.LEVEL) {
            console.log(formatMessage(constants.LOGGING.INFO.DESCRIPTION, ...msg));
        }
    },
    warn: (...msg) => {
        if (loglevel <= constants.LOGGING.WARN.LEVEL) {
            console.log(formatMessage(constants.LOGGING.WARN.DESCRIPTION, ...msg));
        }
    },
    error: (...msg) => {
        if (loglevel <= constants.LOGGING.ERROR.LEVEL) {
            console.log(formatMessage(constants.LOGGING.ERROR.DESCRIPTION, ...msg));
        }
    }
}


const logger = () => {
    return instance;
}


const timestamp = () => `${new Date().toISOString()}`


const formatMessage = (level, ...msg) => {
    return `${level} [${timestamp()}] ${sprintfJs.sprintf(...msg)}`
}

module.exports = { logger, setLogLevel }
