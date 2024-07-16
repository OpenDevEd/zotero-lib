export namespace Collection {
  export namespace Update {
    export interface Collection {
      body: string;
      status: number;
      statusText: string;
      headers: CollectionHeaders;
      config: Config;
    }

    export interface Config {
      url: string;
      method: string;
      data: string;
      headers: ConfigHeaders;
      transformRequest: null[];
      transformResponse: null[];
      timeout: number;
      xsrfCookieName: string;
      xsrfHeaderName: string;
      maxContentLength: number;
      maxBodyLength: number;
      transitional: Transitional;
    }

    export interface ConfigHeaders {
      Accept: string;
      'Content-Type': string;
      'User-Agent': string;
      'Zotero-API-Version': string;
      'Zotero-API-Key': string;
      'Content-Length': number;
    }

    export interface Transitional {
      silentJSONParsing: boolean;
      forcedJSONParsing: boolean;
      clarifyTimeoutError: boolean;
    }

    export interface CollectionHeaders {
      date: string;
      connection: string;
      server: string;
      'strict-transport-security': string;
      'zotero-api-version': string;
      'zotero-schema-version': string;
      'last-modified-version': string;
    }
  }

  export namespace Get {
    export interface Collection {
      key: string;
      version: number;
      library: Library;
      links: CollectionLinks;
      meta: Meta;
      data: Data;
    }

    export interface Data {
      key: string;
      version: number;
      name: string;
      parentCollection: boolean | string;
      relations: Relations;
    }

    export interface Relations {}

    export interface Library {
      type: string;
      id: number;
      name: string;
      links: LibraryLinks;
    }

    export interface LibraryLinks {
      alternate: Alternate;
    }

    export interface Alternate {
      href: string;
      type: string;
    }

    export interface CollectionLinks {
      self: Alternate;
      alternate: Alternate;
      up?: Alternate;
    }

    export interface Meta {
      numCollections: number;
      numItems: number;
    }
  }
}
