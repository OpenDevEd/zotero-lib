export class BaseConfig {
  user_id: string;
  group_id: string;
  library_type: string;
  api_key: string;
  indent: number;
  verbose: string;
  debug: boolean;
  config: string;
  config_json: string;
}

export const validConfigKeys = [
  'user-id',
  'group-id',
  'library-type',
  'api-key',
  'indent',
  'verbose',
  'debug',
  'config',
  'config-json',
  'zotero-schema',
];
