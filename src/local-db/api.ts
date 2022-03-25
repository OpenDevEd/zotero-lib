const axios = require('axios');
function getZoteroURL(subpath = '') {
  const BASE_URL = 'https://api.zotero.org';

  if (subpath.trim().length) {
    return `${BASE_URL}/${subpath}`;
  }

  return BASE_URL;
}

export async function fetchCurrentKey(
  options: { api_key: string } = { api_key: '' },
) {
  const { api_key } = options;

  const headers = { Authorization: `Bearer ${api_key}` };

  return axios
    .get(getZoteroURL('keys/current'), { headers })
    .then((res) => res.data);
}

export async function fetchGroups(
  options: { api_key: string; user_id } = { api_key: '', user_id: '' },
) {
  const { api_key, user_id } = options;

  const headers = { Authorization: `Bearer ${api_key}` };

  return axios
    .get(getZoteroURL(`users/${user_id}/groups/?format=versions`), { headers })
    .then((res) => res.data);
}
