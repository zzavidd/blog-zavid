import { alert, setAlert } from 'components/alert.js';
import { clearUser } from 'reducers/actions';
import configureStore from 'reducers/store.js';

const { store } = configureStore();

const axios = require('axios');

/**
 * Abstract function for HTTP requests.
 * @param {object} request - The request details.
 * @param {string} request.url - The url to make the request to.
 * @param {string} [request.method] - The method of the request. Defaults to GET.
 * @param {object} [request.body] - The payload for the request.
 * @param {object} [request.headers] - The headers to accompany the request.
 * @param {Function} request.onSuccess - Function triggered on successful request.
 * @param {Function} request.onError - Function triggered on successful request.
 * @param {Function} [request.done] - The callback to finish the test.
 */
export default ({ url, method = 'GET', body, headers = {}, onSuccess }) => {
  headers['Content-Type'] = 'application/json';

  axios({
    url,
    method,
    data: body,
    headers
  })
    .then(({ data }) => {
      onSuccess(data);
    })
    .catch((error) => {
      // const message = error.response ? error.response.data.message : error;
      // if (message === 'Your access token is expired.') {
      //   setAlert({ type: 'info', message: `Your session has expired.` });
      //   setTimeout(() => (location.href = '/'), 500);
      // } else {
      //   alert.error(message);
      // }
    });
};
