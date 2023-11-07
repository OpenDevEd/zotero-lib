// interface ZoteroInterface {
//   collections(args: ZoteroTypes.CollectionsArgs): Promise<void>;
// }

namespace ZoteroTypes {
  export interface zoterocongif {
    user_id?: string;
    group_id?: string;
    library_type?: string;
    api_key?: string;
    indent?: boolean;
    verbose?: boolean;
    debug?: boolean;
    config?: string;
    config_json?: string;
    zotero_schema?: string;
  }

  export interface __getArgs extends zoterocongif {
    root?: boolean;
    uri: string[];
    show?: boolean;
  }

  export interface __postArgs extends zoterocongif {
    uri: string;
    data: string;
  }

  export interface __putArgs extends zoterocongif {
    uri: string;
    data: string;
  }

  export interface __patchArgs extends zoterocongif {
    uri: string;
    data: string;
    version: string;
  }

  export interface __deleteArgs extends zoterocongif {
    uri: string[];
  }

  export interface keyArgs extends zoterocongif {
    key: string;
    groups?: boolean;
    terse?: boolean;
  }

  export interface CollectionsArgs extends zoterocongif {
    key: string;
    dryrun?: boolean;
    show?: boolean;
    version?: boolean;
    top?: boolean;
    create_child?: string[];
    func?: string;
    terse?: boolean;
  }

  export interface CollectionArgs extends zoterocongif {
    key: string;
    dryrun?: boolean;
    show?: boolean;
    version?: boolean;
    func?: string;
    tags?: boolean;
    itemkeys?: string[];
    add?: string[];
    remove?: string[];
  }

  export interface ItemArgs extends zoterocongif {
    key: string;
    dryrun?: boolean;
    show?: boolean;
    version?: boolean;
    func?: string;
    xpm?: boolean;
    crossref?: boolean;
    crossref_user?: string;
    crossref_submit?: boolean;
    crossref_no_confirm?: boolean;
    zenodo?: boolean;
    author_data?: string;
    switch_names?: boolean;
    organise_extra?: boolean;
    children?: boolean;
    filter?: any;
    addfiles?: string[];
    savefiles?: string[];
    addtocollection?: string[];
    removefromcollection?: string[];
    addtags?: string[];
    removetags?: string[];
    validate?: boolean;
    validate_with?: string;
    switchNames?: boolean;
    fullresponse?: boolean;
  }

  export interface create_itemArgs extends zoterocongif {
    template?: string;
    files?: string[];
    item?: any;
    items?: any;
    fullresponse?: boolean;
  }

  export interface update_itemArgs extends zoterocongif {
    key: string;
    replace?: boolean;
    json?: any;
    file?: string;
    version?: string; // was a number in initialization
    show?: boolean;
    fullresponse?: boolean;
  }

  export interface enclose_item_in_collectionArgs extends zoterocongif {
    key?: string;
    collection?: string;
    title?: string;
  }

  export interface get_doiArgs extends ZoteroTypes.ItemArgs {}

  export interface manageLocalDBArgs extends zoterocongif {
    database: string;
    sync?: boolean;
    lookup?: boolean;
    keys?: string[];
    export_json?: string;
    demon?: string;
    errors?: boolean;
    lockfile?: string;
    lock_timeout?: string;
    fullresponse?: boolean;
    key?: string;
    websocket?: boolean;
  }

  export interface update_doiArgs extends zoterocongif {
    key: string;
    doi?: string;
    zenodoRecordID?: string;
    fullresponse?: boolean;
  }

  export interface attach_linkArgs extends zoterocongif {
    key: string;
    url?: string;
    update_url_field?: boolean;
    title?: string;
    tags?: string[];
    kerko_site_url?: string;
    kerko_url?: string;
    kerko_link_key?: string;
    id?: string;
    zenodo?: boolean;
    decorate?: boolean;
    deposit?: string;
    record?: string;
    doi?: string;
  }

  export interface fieldArgs extends ZoteroTypes.ItemArgs {
    field: string;
    value?: string;
  }

  export interface update_urlArgs extends ZoteroTypes.update_itemArgs {
    value: string;
  }
}

export { ZoteroTypes };

//   public async XXX(args: ZoteroTypes.XXXArgs): Promise<any> {
