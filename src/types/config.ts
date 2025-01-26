export type ZoteroConfig = {
  config?: string;
  config_json?: any;
  verbose?: boolean;
  indent?: number | null;
  'group-id'?: string;
};

export type ZoteroConfigOptions = {
  api_key: string;
  group_id?: string;
  user_id?: string;
  library_type?: string;
  indent?: number;
  zotero_schema?: string;
  out?: string;
  verbose?: boolean;
  show?: boolean;
};
