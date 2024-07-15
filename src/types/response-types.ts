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

export namespace Item {
  export namespace Get {
    export interface Item {
      key: string;
      version: number;
      library: Library;
      links: ItemLinks;
      meta: Meta;
      data: Data;
    }

    export interface Full {
      status?: number;
      message?: string;
      output?: any;
      result?: Item;
      final?: any;
    }

    export interface Data {
      key: string;
      version: number;
      parentItem?: string;
      itemType: string;
      linkMode?: string;
      title: string;
      accessDate: string;
      url: string;
      note?: string;
      contentType?: string;
      charset?: string;
      filename?: string;
      md5?: null | string;
      mtime?: number | null;
      tags: Tag[];
      relations: Relations;
      dateAdded: Date;
      dateModified: Date;
      creators?: Creator[];
      abstractNote?: string;
      websiteTitle?: string;
      websiteType?: string;
      date?: string;
      shortTitle?: string;
      language?: string;
      rights?: string;
      extra?: string;
      collections?: string[];
      publicationTitle?: string;
      volume?: string;
      issue?: string;
      pages?: string;
      series?: string;
      seriesTitle?: string;
      seriesText?: string;
      journalAbbreviation?: string;
      DOI?: string;
      ISSN?: string;
      archive?: string;
      archiveLocation?: string;
      libraryCatalog?: string;
      callNumber?: string;
      seriesNumber?: string;
      numberOfVolumes?: string;
      edition?: string;
      place?: string;
      publisher?: string;
      numPages?: string;
      ISBN?: string;
      distributor?: string;
      genre?: string;
      videoRecordingFormat?: string;
      runningTime?: string;
      artworkMedium?: string;
      artworkSize?: string;
      proceedingsTitle?: string;
      conferenceName?: string;
      manuscriptType?: string;
      reportNumber?: string;
      deleted?: boolean;
    }
    export interface Creator {
      creatorType: string;
      name?: string;
      firstName?: string;
      lastName?: string;
    }

    export interface Relations {
      'owl:sameAs': string;
    }

    export interface Tag {
      tag: string;
      type?: number;
    }

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

    export interface ItemLinks {
      self: Alternate;
      alternate: Alternate;
    }

    export interface Meta {
      creatorSummary: string;
      parsedDate: string;
      numChildren: number;
    }
  }
}

export namespace Items {
  export namespace Get {
    export interface Items {
      key: string;
      version: number;
      library: Library;
      links: ItemLinks;
      meta: Meta;
      data: Data;
    }

    export interface Data {
      key?: string;
      version?: number;
      parentItem?: string;
      itemType?: string;
      linkMode?: string;
      title?: string;
      accessDate?: string;
      url?: string;
      note?: string;
      contentType?: string;
      charset?: string;
      filename?: string;
      md5?: null | string;
      mtime?: number | null;
      tags?: Tag[];
      relations?: Relations;
      dateAdded?: Date;
      dateModified?: Date;
      creators?: Creator[];
      abstractNote?: string;
      websiteTitle?: string;
      websiteType?: string;
      date?: string;
      shortTitle?: string;
      language?: string;
      rights?: string;
      extra?: string;
      collections?: string[];
      publicationTitle?: string;
      volume?: string;
      issue?: string;
      pages?: string;
      series?: string;
      seriesTitle?: string;
      seriesText?: string;
      journalAbbreviation?: string;
      DOI?: string;
      ISSN?: string;
      archive?: string;
      archiveLocation?: string;
      libraryCatalog?: string;
      callNumber?: string;
      seriesNumber?: string;
      numberOfVolumes?: string;
      edition?: string;
      place?: string;
      publisher?: string;
      numPages?: string;
      ISBN?: string;
      distributor?: string;
      genre?: string;
      videoRecordingFormat?: string;
      runningTime?: string;
      artworkMedium?: string;
      artworkSize?: string;
      proceedingsTitle?: string;
      conferenceName?: string;
      manuscriptType?: string;
    }

    export interface Creator {
      creatorType: string;
      firstName?: string;
      lastName?: string;
      name?: string;
    }

    export interface Relations {
      'owl:sameAs'?: string[] | string;
    }

    export interface Tag {
      tag: string;
      type: number;
    }

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

    export interface ItemLinks {
      self: Alternate;
      alternate: Alternate;
      up?: Alternate;
    }

    export interface Meta {
      numChildren?: boolean | number;
      creatorSummary?: string;
      parsedDate?: string;
    }
  }
}
