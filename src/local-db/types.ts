export interface RequestArgs {
  api_key?: string;
  user_id?: string;
  group_id?: string;
}

export interface ZoteroGroup {
  id: number;
  version: number;
  itemsVersion: number;
  data: string;
  createdAt: string;
  updatedAt: string;
}

export interface ZoteroItem {
  key: string;
  version: number;
  synced: boolean;
  data: string;
  createdAt: string;
  updatedAt: string;
}

export interface ZoteroConfig {
  user_id?: string;
  group_id?: string;
  'library-type'?: string;
  api_key?: string;
  indent?: number;
  verbose?: boolean;
  debug?: boolean;
  config?: string;
  'config-json'?: string;
  'zotero-schema'?: string;
  out?: boolean;
  show?: boolean;
  zotero_schema?: string;
  sdk?: boolean;
}

export interface ZoteroArgs extends ZoteroConfig {
  key?: string;
  filter?: string | object;
  savefiles?: boolean;
  addfiles?: string[];
  addtocollection?: string[];
  switchNames?: boolean;
  organise_extra?: boolean;
  crossref_user?: string;
  removefromcollection?: string[];
  addtags?: string[];
  removetags?: string[];
  children?: boolean;
  validate?: boolean;
  validate_with?: string;
  fullresponse?: boolean;
  show?: boolean;
  debug?: boolean;
  uri?: string[];
  root?: string;
  data?: {};
  version?: string | number;
}
