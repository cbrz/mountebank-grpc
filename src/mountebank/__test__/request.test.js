jest.mock('axios');
import { post } from 'axios';
import { sendRequest } from '../request.js';


describe('test send request',() => {
    test('should send response', () => {
        const request = { test: 'value' },
            response = { data: request };
        post.mockImplementation(() => Promise.resolve(response))

        return sendRequest(request)
            .then(res => expect(res).toEqual(request));
    });

    test('should send request', () => {
        const request = {test: 'value'},
            response = {data: request},
            url = 'http://mb.com';
        // mbRequest.setUrl(url);
        post.mockImplementation(() => Promise.resolve(response))

        return sendRequest(url, request)
            .then(() => {
                expect(post).toBeCalled();
                expect(post).toBeCalledWith(url, request);
            });
    });
});