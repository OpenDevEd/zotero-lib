import logger from './logger';
import { as_array } from './utils';

const axios = require('axios');

const base = 'https://api.zotero.org';

export function createHttpClient(options = {}) {
  return new HttpClient(options);
}

export class HttpClient {
  private headers: any;

  constructor({ headers = {} }) {
    this.headers = headers;
  }

  async post(uri, data, headers = {}, config: any = {}) {
    const prefix = config.user_id
      ? `/users/${config.user_id}`
      : `/groups/${config.group_id}`;
    if (!uri.startsWith('http')) {
      uri = `${base}${prefix}${uri}`;
    }
    console.log('POST uri: ' + uri);
    if (config.verbose) console.error('POST', uri);

    console.log('POST data: ', data);
    return axios({
      method: 'POST',
      url: uri,
      headers: {
        ...this.headers,
        'Content-Type': 'application/json',
        ...headers,
      },
      data,
    }).then((res) => res.data);
  }

  async get(
    uri,
    options: {
      fulluri?: boolean;
      userOrGroupPrefix?: boolean;
      params?: any;
      resolveWithFullResponse?: boolean;
      json?: boolean;
      arraybuffer?: boolean;
    } = {},
    config: any = {},
  ) {
    if (typeof options.userOrGroupPrefix === 'undefined')
      options.userOrGroupPrefix = true;

    if (typeof options.params === 'undefined') options.params = {};
    if (typeof options.json === 'undefined') options.json = true;

    let prefix = '';
    if (options.userOrGroupPrefix) {
      prefix = config.user_id
        ? `/users/${config.user_id}`
        : `/groups/${config.group_id}`;
    }

    const params = Object.keys(options.params)
      .map((param) => {
        let values = options.params[param];
        values = as_array(values);
        return values.map((v) => `${param}=${encodeURI(v)}`).join('&');
      })
      .join('&');

    if (!options.fulluri) {
      uri = `${base}${prefix}${uri}${params ? '?' + params : ''}`;
    }
    if (config.verbose) console.error('GET', uri);
    //TODO: remove this
    logger.info('get uri: %s', uri);
    const requestConfig: any = {
      method: 'get',
      url: uri,
      headers: { ...this.headers },
      encoding: null,
      json: options.json,
      resolveWithFullResponse: options.resolveWithFullResponse,
    };

    if (options.arraybuffer) {
      requestConfig.responseType = 'arraybuffer';
    }

    const res = await axios(requestConfig)
      .then(function (response) {
        return {
          body: response.data,
          status: response.status,
          statusText: response.statusText,
          headers: response.headers,
          config: response.config,
        };
      })
      .catch((error) => {
        if (config.verbose) {
          console.log(
            `Error in zotero.get = ${JSON.stringify(error, null, 2)}`,
          );
        }
        logger.error('error in zotero get %O', error);
        // console.log(`Error in zotero.get = ${JSON.stringify(error.error.data, null, 2)}`)
        const message = error.error && error.error.data;
        const shortError = {
          name: error.name,
          statusCode: error.statusCode,
          message,
          url: uri,
          json: options.json,
        };
        console.log(
          'Error in zotero.get = ' + JSON.stringify(shortError, null, 2),
        );
        return error;
      });
    // console.log("all=" + JSON.stringify(res, null, 2))
    if (options.resolveWithFullResponse) {
      return res;
    } else {
      return res.body;
    }
  }

  // TODO: Add resolveWithFullResponse: options.resolveWithFullResponse,
  async put(uri, data, config) {
    const prefix = config.user_id
      ? `/users/${config.user_id}`
      : `/groups/${config.group_id}`;

    uri = `${base}${prefix}${uri}`;
    if (config.verbose) console.error('PUT', uri);

    return axios({
      method: 'PUT',
      url: uri,
      headers: { ...this.headers, 'Content-Type': 'application/json' },
      data,
    })
      .then((res) => {
        return {
          body: res.data,
          status: res.status,
          statusText: res.statusText,
          headers: res.headers,
          config: res.config,
        };
      })
      .catch((error) => {
        console.log('PUT ERROR=' + JSON.stringify(error, null, 2));
        return error;
      });
  }

  // patch does not return any data.
  // TODO: Errors are not handled - add this to patch (below) but needs adding to others.
  async patch(uri, data, version?: number, config?: any) {
    const prefix = config.user_id
      ? `/users/${config.user_id}`
      : `/groups/${config.group_id}`;

    const headers = { ...this.headers, 'Content-Type': 'application/json' };
    if (typeof version !== 'undefined') {
      headers['If-Unmodified-Since-Version'] = version;
    }
    uri = `${base}${prefix}${uri}`;
    if (config.verbose) console.error('PATCH', uri);
    return axios({
      method: 'PATCH',
      url: uri,
      headers,
      data,
      resolveWithFullResponse: true,
    })
      .then((response) => {
        return {
          body: response.data,
          statusCode: response.status,
          statusText: response.statusText,
          headers: response.headers,
          config: response.config,
        };
      })
      .catch((error) => {
        console.log('PAT ERROR=' + JSON.stringify(error, null, 2));
        return error;
      });
  }

  // TODO: Add resolveWithFullResponse: options.resolveWithFullResponse,
  async delete(uri, version?: number, config?: any) {
    const prefix = config.user_id
      ? `/users/${config.user_id}`
      : `/groups/${config.group_id}`;

    const headers = { ...this.headers, 'Content-Type': 'application/json' };
    if (typeof version !== 'undefined') {
      headers['If-Unmodified-Since-Version'] = version;
    }

    uri = `${base}${prefix}${uri}`;
    if (config.verbose) console.error('DELETE', uri);

    return axios({
      method: 'DELETE',
      url: uri,
      headers,
    }).then((res) => res.data);
  }
}
