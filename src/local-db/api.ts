const axios = require('axios');

function getZoteroURL(subpath = '') {
  const BASE_URL = 'https://api.zotero.org';

  if (subpath.trim().length) {
    return `${BASE_URL}/${subpath}`;
  }

  return BASE_URL;
}

export async function fetchCurrentKey(
  options: RequestOptions = { api_key: '' },
) {
  const { api_key } = options;

  const headers = { Authorization: `Bearer ${api_key}` };

  return axios
    .get(getZoteroURL('keys/current'), { headers })
    .then((res) => res.data);
}

interface RequestOptions {
  api_key?: string;
  user_id?: string;
}

export async function fetchGroups(
  options: RequestOptions = { api_key: '', user_id: '' },
) {
  const { api_key, user_id } = options;

  const headers = { Authorization: `Bearer ${api_key}` };

  return axios
    .get(getZoteroURL(`users/${user_id}/groups/?format=versions`), { headers })
    .then((res) => res.data);
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
