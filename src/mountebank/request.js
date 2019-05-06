// handling mountebank requests


const axios = require('axios'),
    log = require('../helpers/logging').logger();


const sendRequest = async (url, data) => {
    log.info('send request to mountebank');
    log.debug(`url='%s', data='%s', config='%s'`, url, JSON.stringify(data));
    try {
        const response = await axios.post(url, data);
        log.debug(`response.data="%s"`, JSON.stringify(response.data));
        return response.data;
    } catch (error) {
        log.error(`error=%s`, JSON.stringify(error));
    }
}


module.exports = { sendRequest };
