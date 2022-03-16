import { BaseConfig, validConfigKeys } from './config';

import Zotero from './zotero-lib';

function getFakeConfig(): BaseConfig {
  return validConfigKeys.reduce((a, c) => ({ ...a, [c]: c }), {}) as BaseConfig;
}

describe('Zotero Lib', () => {
  test('loads config correctly', () => {
    const testConfig = getFakeConfig();
    delete testConfig.user_id;
    const jsonConfig = JSON.stringify(testConfig);
    const zotero = new Zotero({ config_json: jsonConfig });
    expect(zotero.config).toBe(testConfig);
  });
});
