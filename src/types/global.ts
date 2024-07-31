export type Library = {
  type: string;
  id: number;
  name: string;
  links?: LibraryLinks;
};

type LibraryLinks = {
  alternate?: Alternate;
};

export type Alternate = {
  href?: string;
  type?: string;
  up?: Alternate;
};

export type Relation = {
  [key: string]: string[] | string;
};

export type ResponseLinks = {
  self?: Alternate;
  alternate?: Alternate;
  up?: Alternate;
};

export type ConfigHeaders = {
  Accept?: string;
  'Content-Type'?: string;
  'User-Agent'?: string;
  'Zotero-API-Version'?: string;
  'Zotero-API-Key'?: string;
  'If-Unmodified-Since-Version'?: number;
  'Content-Length'?: number;
};

export type Transitional = {
  silentJSONParsing?: boolean;
  forcedJSONParsing?: boolean;
  clarifyTimeoutError?: boolean;
};

export type ResponseConfig = {
  url?: string;
  method?: string;
  data?: ConfigData;
  headers?: ConfigHeaders;
  transformRequest?: null[];
  transformResponse?: null[];
  timeout?: number;
  xsrfCookieName?: string;
  xsrfHeaderName?: string;
  maxContentLength?: number;
  maxBodyLength?: number;
  transitional?: Transitional;
  resolveWithFullResponse?: boolean;
};

type ConfigData = {
  type: string;
  data: number[];
};

export type ResponseHeaders = {
  date?: string;
  connection?: string;
  server?: string;
  'strict-transport-security'?: string;
  'zotero-api-version'?: string;
  'zotero-schema-version'?: string;
  'last-modified-version'?: string;
};
