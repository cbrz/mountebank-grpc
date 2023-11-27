'use strict'


const bufferToBase64 = (data) => {
    return walk(data, (d) => {
        if (Buffer.isBuffer(d)) {
            return d.toString('base64');
        }
        return d;
    });
}


const walk = (data, callback) => {
    if (typeof data === 'object') {
        if (!data) {
            return callback(data);
        }
        if (Array.isArray(data)) {
            const length = data.length;
            for (var i=0; i<length; ++i) {
                data[i] = walk(data[i], callback);
            }
            return callback(data);
        }
        if (Object.keys(data).length) {
            for (var k in data) {
                if (Object.prototype.hasOwnProperty.call(data, k)) {
                    data[k] = walk(data[k], callback);
                }
            }
            return callback(data);
        }
    }
    return callback(data);
}


export {
    bufferToBase64
}