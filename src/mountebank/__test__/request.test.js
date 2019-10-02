jest.mock('axios');
const axios = require('axios'),
    mbRequest = require('../request');


describe('test send request',() => {
    test('should send response', () => {
        const request = { test: 'value' },
            response = { data: request };
        axios.post.mockImplementation(() => Promise.resolve(response))

        return mbRequest.sendRequest(request)
            .then(res => expect(res).toEqual(request));
    });

    test('should send request', () => {
        const request = {test: 'value'},
            response = {data: request},
            url = 'http://mb.com';
        // mbRequest.setUrl(url);
        axios.post.mockImplementation(() => Promise.resolve(response))

        return mbRequest.sendRequest(url, request)
            .then(() => {
                expect(axios.post).toBeCalled();
                expect(axios.post).toBeCalledWith(url, request);
            });
    });
});