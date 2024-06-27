import logger from './logger';
import { as_array } from './utils';

const axios = require('axios');

const base = 'https://api.zotero.org';

export function createHttpClient(options = {}) {
  return new HttpClient(options);
}

export class HttpClient {
  private headers: any;

  /**
   * @param args.header - headers to be passed in the request
   */
  constructor({ headers = {} }) {
    this.headers = headers;
  }

  /**
   * The post method is used to send data to zotero.
   * @param uri - the uri to send the data to
   * @param data - the data to be sent
   * @param headers - headers to be passed in the request
   * @param config - configuration object
   * @param config.user_id - the user id
   * @param config.group_id - the group id
   * @param config.verbose - verbose mode
   * @returns the response from the server
   */
  async post(uri: string, data: any, headers = {}, config: any = {}) {
    const prefix = config.user_id ? `/users/${config.user_id}` : `/groups/${config.group_id}`;
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
    }).then((res: { data: any }) => res.data);
  }

  /**
   * The get method is used to get data from zotero.
   * @param uri - the uri to get the data from
   * @param options - options to be passed in the request
   * @param options.fulluri - whether to use the full uri
   * @param options.userOrGroupPrefix - whether to use the user or group prefix, if not provided it defaults to true
   * @param options.params - the parameters to be passed in the request
   * @param options.resolveWithFullResponse - resolve with full response axios param, see axios documentation
   * @param options.json - json axios param, see axios documentation
   * @param options.arraybuffer - wheter to pass responseType as arraybuffer, see axios documentation
   * @param config - configuration object
   * @param config.user_id - the zotero user id it will be used if userOrGroupPrefix is not false
   * @param config.group_id - the the zotero group id it will be used if user_id is not provided
   * @param config.verbose - verbose mode
   * @returns the response from zotero.
   */
  async get(
    uri: string,
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
    if (typeof options.userOrGroupPrefix === 'undefined') options.userOrGroupPrefix = true;

    if (typeof options.params === 'undefined') options.params = {};
    if (typeof options.json === 'undefined') options.json = true;

    let prefix = '';
    if (options.userOrGroupPrefix) {
      prefix = config.user_id ? `/users/${config.user_id}` : `/groups/${config.group_id}`;
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
          console.log(`Error in zotero.get = ${JSON.stringify(error, null, 2)}`);
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
        console.log('Error in zotero.get = ' + JSON.stringify(shortError, null, 2));
        return error;
      });
    // console.log("all=" + JSON.stringify(res, null, 2))
    if (options.resolveWithFullResponse) {
      return res;
    } else {
      return res.body;
    }
  }

  // TODO: Add resolveWithFullResponse: options.resolveWithFullResponse,'
  /**
   * The put method is used to update data in zotero.
   * @param uri - the uri to update the data
   * @param data - the data to be updated
   * @param config - configuration object
   * @param config.user_id - the zotero user id
   * @param config.group_id - the zotero group id it will be used if user_id is not provided
   * @param config.verbose - verbose mode
   * @returns the response from zotero
   */
  async put(uri: string, data: any, config: any) {
    const prefix = config.user_id ? `/users/${config.user_id}` : `/groups/${config.group_id}`;

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
  /**
   * The patch method is used to update data in zotero.
   * @param uri - the uri to update the data
   * @param data - the data to be updated
   * @param version - the version of the data
   * @param config - configuration object
   * @param config.user_id - the zotero user id
   * @param config.group_id - the zotero group id it will be used if user_id is not provided
   * @param config.verbose - verbose mode
   * @returns the response from zotero
   */
  async patch(uri: string, data: any, version?: number | string, config?: any) {
    const prefix = config.user_id ? `/users/${config.user_id}` : `/groups/${config.group_id}`;

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
      .catch((error: any) => {
        console.log('PAT ERROR=' + JSON.stringify(error, null, 2));
        return error;
      });
  }

  // TODO: Add resolveWithFullResponse: options.resolveWithFullResponse,
  /**
   * The delete method is used to delete data from zotero.
   * @param uri - the uri to delete the data
   * @param version - the version of the data
   * @param config - configuration object
   * @param config.user_id - the zotero user id
   * @param config.group_id - the zotero group id it will be used if user_id is not provided
   * @param config.verbose - verbose mode
   * @returns the response from zotero
   */
  async delete(uri: string, version?: number, config?: any) {
    const prefix = config.user_id ? `/users/${config.user_id}` : `/groups/${config.group_id}`;

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
    }).then((res: { data: any }) => res.data);
  }
}
