export type CollectionResponse = {
  key: string;
  version: number;
  library: Library;
  links?: CollectionLinks;
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

type Relation = {
  [key: string]: string[] | string;
};

type Library = {
  type: string;
  id: number;
  name: string;
  links?: LibraryLinks;
};

type LibraryLinks = {
  alternate?: Alternate;
};

type Alternate = {
  href?: string;
  type?: string;
};

type CollectionLinks = {
  self?: Alternate;
  alternate?: Alternate;
  up?: Alternate;
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

type ConfigHeaders = {
  Accept?: string;
  'Content-Type'?: string;
  'User-Agent'?: string;
  'Zotero-API-Version'?: string;
  'Zotero-API-Key'?: string;
  'Content-Length'?: number;
};

type Transitional = {
  silentJSONParsing?: boolean;
  forcedJSONParsing?: boolean;
  clarifyTimeoutError?: boolean;
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
