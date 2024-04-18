
namespace ZoteroTypes {
  export interface IZoterocongif {
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

  export interface IGetArgs extends IZoterocongif {
    root?: boolean;
    uri: string[];
    show?: boolean;
  }

  export interface IPostArgs extends IZoterocongif {
    uri: string;
    data: string;
  }

  export interface IPutArgs extends IZoterocongif {
    uri: string;
    data: string;
  }

  export interface IPatchArgs extends IZoterocongif {
    uri: string;
    data: string;
    version: string;
  }

  export interface IDeleteArgs extends IZoterocongif {
    uri: string[];
  }

  export interface IKeyArgs extends IZoterocongif {
    key: string;
    groups?: boolean;
    terse?: boolean;
  }

  export interface ICollectionsArgs extends IZoterocongif {
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

  export interface ICollectionArgs extends IZoterocongif {
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

  export interface IItemArgs extends IZoterocongif {
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

  export interface ICreateItemArgs extends IZoterocongif {
    template?: string;
    files?: string[];
    item?: any;
    items?: any;
    fullresponse?: boolean;
    newcollection?: string[];
    collections?: string[];
  }

  export interface IUpdateItemArgs extends IZoterocongif {
    key: string;
    replace?: boolean;
    json?: any;
    file?: string;
    version?: string; // was a number in initialization
    show?: boolean;
    fullresponse?: boolean;
  }

  export interface IEncloseItemInICollectionArgs extends IZoterocongif {
    key?: string;
    collection?: string;
    title?: string;
  }

  export interface IGetDoiArgs extends ZoteroTypes.IItemArgs {}

  export interface IManageLocalDBArgs extends IZoterocongif {
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

  export interface IUpdateDoiArgs extends IZoterocongif {
    key: string;
    doi?: string;
    zenodoRecordID?: string;
    fullresponse?: boolean;
  }

  export interface IAttachLinkArgs extends IZoterocongif {
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

  export interface IDeduplicateFuncArgs extends ZoteroTypes.IZoterocongif {
    files?: string[];
    collection?: string;
  }
  export interface IMoveDeduplicateToICollectionArgs extends ZoteroTypes.IZoterocongif {
    file?: string;
    collection?: string;
  }
  //MergeFuncArgs
  export interface IMergeFuncArgs extends ZoteroTypes.IZoterocongif {
    data?: string;
    options?: string;
  }
  //ResolvefuncArgs
  export interface IResolvefuncArgs extends ZoteroTypes.IZoterocongif {
    groupid?: string;
    keys?: string[];
  }
  //KerkoCiteItemAlsoKnownAsArgs
  export interface IKerkoCiteItemAlsoKnownAsArgs extends ZoteroTypes.IItemArgs {
    fullresponse?: boolean;
    add?: string[];
  }
  //GetBibArgs
  export interface IGetZoteroDataXArgs extends ZoteroTypes.IZoterocongif {
    key?: string;
    keys?: string[];
    zgroup?: string;
    zkey?: string;
    openinzotero?: boolean;
    test?: boolean;
    json?: boolean;
    groupkeys?: string;
  }
  export interface IGetBibArgs extends ZoteroTypes.IGetZoteroDataXArgs {
    xml?: boolean;
  }
  //MakeZoteroQueryArgs
  export interface IMakeZoteroQueryArgs extends ZoteroTypes.IZoterocongif {
    key?: string;
    keys?: string[];
    group?: string;
  }
  //MakeMultiQueryArgs
  export interface IMakeMultiQueryArgs extends ZoteroTypes.IZoterocongif {
    groupkeys?: string;
  }
  //AttachNoteArgs
  export interface AttachNoteArgs extends ZoteroTypes.IZoterocongif {
    notetext: string;
    key?: string;
    notefile?: string;
    tags?: string[];
  }
  //FindEmptyItemsArgs
  export interface IFindEmptyItemsArgs extends ZoteroTypes.IZoterocongif {
    output?: string;
    delete?: boolean;
    onlykeys?: boolean;
  }
}

export { ZoteroTypes };

//   public async XXX(args: ZoteroTypes.XXXArgs): Promise<any> {
