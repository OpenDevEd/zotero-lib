import logger from './logger';
import { as_array } from './utils';

const axios = require('axios');

const base = 'https://api.zotero.org';

export function createHttpClient(options = {}) {
  console.log('creating client with options: ', options);
  const client = new HttpClient(options);
  return client;
}

export class HttpClient {
  private headers: any;

  constructor({ headers = {} }) {
    this.headers = headers;
  }

  async post(uri, data, headers = {}, config) {
    const prefix = config.user_id
      ? `/users/${config.user_id}`
      : `/groups/${config.group_id}`;
    console.log('POST' + uri);
    uri = `${base}${prefix}${uri}`;
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
    config,
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
    logger.info('get uri: %s', uri);

    const requestConfig = {
      url: uri,
      headers: { ...this.headers },
      encoding: null,
      json: options.json,
      resolveWithFullResponse: options.resolveWithFullResponse,
    };

    const requestConfig2 = options.arraybuffer
      ? {
          ...requestConfig,
          responseType: 'arraybuffer',
        }
      : requestConfig;

    const res = await axios(requestConfig2)
      .then(
        // (resp) => resp.data
        /*
        (response) => {
          body: response.data,
          status: response.status,
          statusText: response.statusText,
          headers: response.headers,
          config: response.config
          }  */
        function (response) {
          const out = {
            body: response.data,
            status: response.status,
            statusText: response.statusText,
            headers: response.headers,
            config: response.config,
          };
          // console.log("response-TEMPORARY=" + JSON.stringify(out, null, 2))
          return out;
        },
      )
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
        // console.log("DEBUG", (new Error().stack));
        // console.log(shortError)
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

    const response = axios({
      method: 'PUT',
      url: uri,
      headers: { ...this.headers, 'Content-Type': 'application/json' },
      data,
    })
      .then((response) => {
        const out = {
          body: response.data,
          status: response.status,
          statusText: response.statusText,
          headers: response.headers,
          config: response.config,
        };
        // console.log("TEMPOARY PAT=" + JSON.stringify(out, null, 2));
        return out;
      })
      .catch((error) => {
        console.log('PUT ERROR=' + JSON.stringify(error, null, 2));
        return error;
      });
    return response;
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
    const res = await axios({
      method: 'PATCH',
      url: uri,
      headers,
      data,
      resolveWithFullResponse: true,
    })
      .then((response) => {
        const out = {
          body: response.data,
          statusCode: response.status,
          statusText: response.statusText,
          headers: response.headers,
          config: response.config,
        };
        // console.log("TEMPOARY PAT=" + JSON.stringify(out, null, 2));
        return out;
      })
      .catch((error) => {
        console.log('PAT ERROR=' + JSON.stringify(error, null, 2));
        return error;
      });
    return res;
  }

  // TODO: Add       resolveWithFullResponse: options.resolveWithFullResponse,
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

    //      console.log("TEMPORARY="+JSON.stringify(      uri      ,null,2))

    return axios({
      method: 'DELETE',
      url: uri,
      headers,
    }).then((res) => res.data);
  }
}
