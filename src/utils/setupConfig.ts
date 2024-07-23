import { input, select } from '@inquirer/prompts';
import fs from 'fs';
import os from 'os';
import { IConfig } from '../types/config';

export const configSetup = async () => {
  let config: IConfig = {
    api_key: '',
    group_id: '',
    library_type: '',
    indent: 4,
  };
  // ask for config
  config.api_key = await input({ message: 'Enter your api_key?' });
  config.library_type = await select({
    message: 'Select your library type?',
    choices: [
      {
        value: 'group',
        name: 'group',
      },
      {
        value: 'user',
        name: 'user',
      },
    ],
  });
  if (config.library_type === 'user') config.user_id = await input({ message: 'Enter your user id?' });
  else config.group_id = await input({ message: 'Enter your group id?' });

  const configDir = `${os.homedir()}/.config/zotero-cli`;
  !fs.existsSync(configDir) ? fs.mkdirSync(configDir, { recursive: true }) : null;
  let toml = '';
  // create toml file
  if (config.library_type === 'group')
    toml = `
api_key = "${config.api_key}"
group_id = "${config.group_id}"
library_type = "${config.library_type}"
indent = ${config.indent}`;
  else
    toml = `
  api_key = "${config.api_key}"
  user_id = "${config.user_id}"
  library_type = "${config.library_type}"
  indent = ${config.indent}`;

  fs.writeFileSync(`${configDir}/zotero-cli.toml`, toml);
};
