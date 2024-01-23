// handling mountebank requests


import axios from 'axios';
import logging from '../helpers/logging.js';
const log = logging.logger();


const sendRequest = async (url, data) => {
    log.debug('send request to mountebank');
    log.debug(`url='%s', data='%s'`, url, JSON.stringify(data));
    try {
        const response = await axios.post(url, data);
        log.debug(`response.data="%s"`, JSON.stringify(response.data));
        return response.data;
    } catch (error) {
        log.error(`error=%s`, JSON.stringify(error));
    }
}


export { sendRequest };
