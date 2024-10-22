import { Library, Relation, ResponseConfig, ResponseHeaders, ResponseLinks } from './global';

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
  headers: ResponseHeaders;
  config: ResponseConfig;
};
