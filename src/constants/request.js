import { alert, setAlert } from 'components/alert.js';
import { clearUser } from 'reducers/actions';

const axios = require('axios');

/**
 * Abstract function for HTTP requests.
 * @param {object} request - The request details.
 * @param {object} [request.query] - The GraphQL query for the request.
 * @param {Function} request.onSuccess - Function triggered on successful request.
 * @param {Function} request.onError - Function triggered on successful request.
 * @param {Function} [request.done] - The callback to finish the test.
 */
export default ({ query, onSuccess }) => {
  axios({
    url: '/api',
    method: 'POST',
    data: query,
    headers: {
      'Content-Type': 'application/json'
    }
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
