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
    recursive?: boolean;
    json?: string;
    isSub?: boolean;
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
    newcollection?: string[];
    collections?: string[];
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

  export interface delete_itemArgs extends zoterocongif {
    key: string;
    version?: string;
    fullresponse?: boolean;
  }

  export interface delete_itemsArgs extends zoterocongif {
    keys: string[];
    fullresponse?: boolean;
  }

  export interface update_collectionArgs extends zoterocongif {
    key: string;
    json?: any;
    version?: string;
    fullresponse?: boolean;
  }

  export interface delete_collectionArgs extends zoterocongif {
    key: string;
    version?: string;
    fullresponse?: boolean;
  }

  export interface delete_collectionsArgs extends zoterocongif {
    keys: string[];
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

  export interface deduplicate_func_Args extends ZoteroTypes.zoterocongif {
    files?: string[];
    collection?: string;
  }
  export interface Move_deduplicate_to_collection_Args extends ZoteroTypes.zoterocongif {
    file?: string;
    collection?: string;
  }
  //merge_func_Args
  export interface merge_func_Args extends ZoteroTypes.zoterocongif {
    data?: string;
    options?: string;
  }
  //resolvefunc_Args
  export interface resolvefunc_Args extends ZoteroTypes.zoterocongif {
    groupid?: string;
    keys?: string[];
  }
  //KerkoCiteItemAlsoKnownAs_Args
  export interface KerkoCiteItemAlsoKnownAs_Args extends ZoteroTypes.ItemArgs {
    fullresponse?: boolean;
    add?: string[];
  }
  //getbib_Args
  export interface getZoteroDataX_args extends ZoteroTypes.zoterocongif {
    key?: string;
    keys?: string[];
    zgroup?: string;
    zkey?: string;
    openinzotero?: boolean;
    test?: boolean;
    json?: boolean;
    groupkeys?: string;
  }
  export interface getbib_args extends ZoteroTypes.getZoteroDataX_args {
    xml?: boolean;
  }
  //makeZoteroQuery_args
  export interface makeZoteroQuery_args extends ZoteroTypes.zoterocongif {
    key?: string;
    keys?: string[];
    group?: string;
  }
  //makeMultiQuery_args
  export interface makeMultiQuery_args extends ZoteroTypes.zoterocongif {
    groupkeys?: string;
  }
  //attach_noteArgs
  export interface attach_noteArgs extends ZoteroTypes.zoterocongif {
    notetext: string;
    key?: string;
    notefile?: string;
    tags?: string[];
  }
  //findEmptyItemsArgs
  export interface findEmptyItemsArgs extends ZoteroTypes.zoterocongif {
    output?: string;
    delete?: boolean;
    onlykeys?: boolean;
  }
}

export { ZoteroTypes };

//   public async XXX(args: ZoteroTypes.XXXArgs): Promise<any> {
