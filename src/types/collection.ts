import { ConfigHeaders, Library, Relation, ResponseLinks, Transitional } from './global';

export type CollectionResponse = {
  key: string;
  version: number;
  library: Library;
  links?: ResponseLinks;
  meta: Meta;
  data: Collection;
};

export type Collection = {
  key: string;
  version: number;
  name: string;
  parentCollection?: boolean | string;
  relations?: Relation;
};

type Meta = {
  numCollections: number;
  numItems: number;
};

// Update Collection Types

export type UpdateCollectionResponse = {
  body: string;
  status: number;
  statusText: string;
  headers: CollectionHeaders;
  config: Config;
};

type Config = {
  url?: string;
  method?: string;
  data?: string;
  headers?: ConfigHeaders;
  transformRequest?: null[];
  transformResponse?: null[];
  timeout?: number;
  xsrfCookieName?: string;
  xsrfHeaderName?: string;
  maxContentLength?: number;
  maxBodyLength?: number;
  transitional?: Transitional;
};

type CollectionHeaders = {
  date?: string;
  connection?: string;
  server?: string;
  'strict-transport-security'?: string;
  'zotero-api-version'?: string;
  'zotero-schema-version'?: string;
  'last-modified-version'?: string;
};
