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
