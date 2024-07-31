// interface ZoteroInterface {
//   collections(args: ZoteroTypes.CollectionsArgs): Promise<void>;
// }

namespace ZoteroTypes {
  export interface IZoteroCongif {
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

  export interface __getArgs extends IZoteroCongif {
    root?: boolean;
    uri: string[];
    show?: boolean;
  }
  export interface __postArgs extends IZoteroCongif {
    uri: string;
    data: string;
  }

  export interface __putArgs extends IZoteroCongif {
    uri: string;
    data: string;
  }

  export interface __patchArgs extends IZoteroCongif {
    uri: string;
    data: string;
    version: string;
  }

  export interface __deleteArgs extends IZoteroCongif {
    uri: string[];
  }

  export interface IKeyArgs extends IZoteroCongif {
    key: string;
    groups?: boolean;
    terse?: boolean;
  }

  export interface ICollectionsArgs extends IZoteroCongif {
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

  export interface ICollectionArgs extends IZoteroCongif {
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

  export interface IItemArgs extends IZoteroCongif {
    key: string;
    dryrun?: boolean;
    show?: boolean;
    version?: boolean;
    func?: string;
    xpm?: boolean;
    crossref?: boolean;
    crossref_user?: string;
    crossref_user_json?: any;
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
    tags?: boolean | string[];
  }

  export interface ICreateItemArgs extends IZoteroCongif {
    template?: string;
    files?: string[];
    item?: any;
    items?: any;
    fullresponse?: boolean;
    newcollection?: string[];
    collections?: string[];
  }

  export interface IUpdateItemArgs extends IZoteroCongif {
    key: string;
    replace?: boolean;
    json?: any;
    file?: string;
    version?: string; // was a number in initialization
    show?: boolean;
    fullresponse?: boolean;
  }

  export interface IDeleteItemArgs extends IZoteroCongif {
    key: string;
    version?: string;
    fullresponse?: boolean;
  }

  export interface IDeleteItemsArgs extends IZoteroCongif {
    keys: string[];
    fullresponse?: boolean;
  }

  export interface IUpdateCollectionArgs extends IZoteroCongif {
    key: string;
    json?: any;
    version?: string;
    fullresponse?: boolean;
  }

  export interface IDeleteCollectionArgs extends IZoteroCongif {
    key: string;
    version?: string;
    fullresponse?: boolean;
  }

  export interface IDeleteCollectionsArgs extends IZoteroCongif {
    keys: string[];
    fullresponse?: boolean;
  }

  export interface ISearchesArgs extends IZoteroCongif {
    create?: string[];
    delete?: string[];
    key?: string;
  }

  export interface IEncloseItemInCollectionArgs extends IZoteroCongif {
    key?: string;
    collection?: string;
    title?: string;
  }

  export interface IGetDoiArgs extends ZoteroTypes.IItemArgs {}

  export interface IManageLocalDBArgs extends IZoteroCongif {
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

  export interface IUpdateDoiArgs extends IZoteroCongif {
    key: string;
    doi?: string;
    zenodoRecordID?: string;
    fullresponse?: boolean;
  }

  export interface IAttachLinkArgs extends IZoteroCongif {
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

  export interface IFieldArgs extends ZoteroTypes.IItemArgs {
    field: string;
    value?: string;
    extra?: boolean;
  }

  export interface IUpdateUrlArgs extends ZoteroTypes.IUpdateItemArgs {
    value: string;
  }

  export interface IDeduplicateFuncArgs extends ZoteroTypes.IZoteroCongif {
    files?: string[];
    collection?: string;
  }
  export interface IMoveDeduplicateToCollectionArgs extends ZoteroTypes.IZoteroCongif {
    file?: string;
    collection?: string;
  }
  //merge_func_Args
  export interface IMergeFuncArgs extends ZoteroTypes.IZoteroCongif {
    data?: string;
    options?: string;
  }
  //resolvefunc_Args
  export interface IResolveFuncArgs extends ZoteroTypes.IZoteroCongif {
    groupid?: string;
    keys?: string[];
  }
  //KerkoCiteItemAlsoKnownAs_Args

  export interface IKerkoCiteItemAlsoKnownAsArgs extends ZoteroTypes.IItemArgs {
    fullresponse?: boolean;
    add?: string[];
  }

  //getbib_Args
  export interface IGetZoteroDataXargs extends ZoteroTypes.IZoteroCongif {
    key?: string;
    keys?: string[];
    zgroup?: string;
    zkey?: string;
    openinzotero?: boolean;
    test?: boolean;
    json?: boolean;
    groupkeys?: string;
  }

  export interface IGetbibArgs extends ZoteroTypes.IGetZoteroDataXargs {
    xml?: boolean;
  }
  //makeZoteroQuery_args
  export interface IMakeZoteroQueryArgs extends ZoteroTypes.IZoteroCongif {
    key?: string;
    keys?: string[];
    group?: string;
  }

  //makeMultiQuery_args
  export interface IMakeMultiQueryArgs extends ZoteroTypes.IZoteroCongif {
    groupkeys?: string;
  }
  //attach_noteArgs
  export interface IAttachNoteArgs extends ZoteroTypes.IZoteroCongif {
    notetext: string;
    key?: string;
    notefile?: string;
    tags?: string[];
  }
  //findEmptyItemsArgs
  export interface IFindEmptyItemsArgs extends ZoteroTypes.IZoteroCongif {
    output?: string;
    delete?: boolean;
    onlykeys?: boolean;
  }

  export interface IGetIdsArgs extends ZoteroTypes.IZoteroCongif {
    key?: string;
  }

  export interface ITrashArgs extends ZoteroTypes.IZoteroCongif {
    tags?: boolean;
  }

  export interface ITagsArgs extends ZoteroTypes.IZoteroCongif {
    filter?: string;
    count?: boolean;
  }

  export interface ISyncToLocalDBArgs {
    user_id?: string;
    groupid?: string;
    api_key?: string;
    group_id?: string;
  }

  export interface IZenodoArgs extends IZoteroCongif {
    zenodoWriteFile?: boolean;
    author_data?: string;
  }

  export interface IWebsocketConfig {
    api_key: any;
    group_id?: string;
    user_id?: string;
    library_type?: string;
    indent?: number;
    zotero_schema?: string;
    out?: string;
    verbose?: boolean;
    show?: boolean;
  }
}

export { ZoteroTypes };

//   public async XXX(args: ZoteroTypes.XXXArgs): Promise<any> {
