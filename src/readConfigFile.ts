const os = require('os');
const toml = require('@iarna/toml');
const fs = require('fs');

/**
 * This function read a config file and returns the content as an object.
 *
 * First it will look for the config file in the path provided in the args object.
 *
 * If it doesn't find it, it will look for it in the current directory.
 *
 * If it doesn't find it, it will look for it in the default path.
 *
 * @param args.config - the path to the config file.
 * @returns the content of the config file as an object.
 */
export function readConfigFile(args: any) {
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
