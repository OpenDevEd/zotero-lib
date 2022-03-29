import { RequestArgs } from './types';

const axios = require('axios');

function getZoteroURL(subpath = '') {
  const BASE_URL = 'https://api.zotero.org';

  if (subpath.trim().length) {
    return `${BASE_URL}/${subpath}`;
  }

  return BASE_URL;
}

export async function fetchCurrentKey(options: RequestArgs = { api_key: '' }) {
  const { api_key } = options;

  const headers = { Authorization: `Bearer ${api_key}` };

  return axios
    .get(getZoteroURL('keys/current'), { headers })
    .then((res) => res.data);
}

export async function fetchGroups(
  options: RequestArgs = { api_key: '', user_id: '' },
) {
  const { api_key, user_id } = options;

  const headers = { Authorization: `Bearer ${api_key}` };

  return axios
    .get(getZoteroURL(`users/${user_id}/groups/?format=versions`), { headers })
    .then((res) => res.data);
}

export async function fetchGroupData(
  options: RequestArgs = { api_key: '', user_id: '' },
) {
  const { api_key, group_id } = options;

  const headers = { Authorization: `Bearer ${api_key}` };

  const requestURL = getZoteroURL(`groups/${group_id}`);
  return axios.get(requestURL, { headers }).then((res) => {
    return res.data;
  });
}

export async function getChangedItemsForGroup(options) {
  const { api_key, group, version = 0 } = options;
  const headers = { Authorization: `Bearer ${api_key}` };

  return axios
    .get(
      getZoteroURL(
        `groups/${group}/items/top?since=${version}&format=versions&includeTrashed=1`,
      ),
      { headers },
    )
    .then((res) => res.data);
}

export async function fetchItemsByIds(options) {
  const { api_key, group, itemIds } = options;
  const headers = { Authorization: `Bearer ${api_key}` };

  return axios.get(getZoteroURL(`groups/${group}/items/?itemKey=${itemIds}`), {
    headers,
  });
}
