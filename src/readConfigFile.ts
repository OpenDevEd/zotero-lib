import { ZoteroConfig, ZoteroConfigResult } from './types/config';

const os = require('os');
const toml = require('@iarna/toml');
const fs = require('fs');

export function readConfigFile(args: ZoteroConfig): ZoteroConfigResult {
  let config = {};

  const configPath: string = [
    args.config,
    'zotero-cli.toml',
    `${os.homedir()}/.config/zotero-cli/zotero-cli.toml`,
  ].find((cfg) => fs.existsSync(cfg));

  if (configPath) {
    config = toml.parse(fs.readFileSync(configPath, 'utf-8'));
  }

  return config;
}
