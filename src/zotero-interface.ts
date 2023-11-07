// interface ZoteroInterface {
//   collections(args: ZoteroTypes.CollectionsArgs): Promise<void>;
// }

namespace ZoteroTypes {
  export interface zoterocongif {
    'user-id'?: string;
    'group-id'?: string;
    'library-type'?: string;
    'api-key'?: string;
    indent?: boolean;
    verbose?: boolean;
    debug?: boolean;
    config?: string;
    'config-json'?: string;
    'zotero-schema'?: string;
  }

  export type __getArgs = {
    root?: boolean;
    uri: string[];
    show?: boolean;
  };

  export type __postArgs = {
    uri: string;
    data: string;
  };

  export type __putArgs = {
    uri: string;
    data: string;
  };

  export type __patchArgs = {
    uri: string;
    data: string;
    version: string;
  };

  export type __deleteArgs = {
    uri: string[];
  };

  export type keyArgs = {
    key: string;
    groups?: boolean;
    terse?: boolean;
    api_key?: string;
  };

  export type CollectionsArgs = {
    key: string;
    verbose?: boolean;
    dryrun?: boolean;
    show?: boolean;
    version?: boolean;
    top?: boolean;
    create_child?: string[];
    func?: string;
    terse?: boolean;
    group_id?: string;
  };

  export type CollectionArgs = {
    key: string;
    verbose?: boolean;
    dryrun?: boolean;
    show?: boolean;
    version?: boolean;
    func?: string;
    tags?: boolean;
    itemkeys?: string[];
    add?: string[];
    remove?: string[];
    group_id?: string;
  };

  export  interface ItemArgs extends zoterocongif  {
    key: string;
    verbose?: boolean;
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
    debug?: boolean;
    fullresponse?: boolean;
    group_id?: string;
  };

  export type create_itemArgs = {
    template?: string;
    files?: string[];
    item?: any;
    items?: any;
    fullresponse?: boolean;
  };

  export type update_itemArgs = {
    key: string;
    replace?: boolean;
    json?: any;
    file?: string;
    version?: string; // was a number in initialization
    show?: boolean;
    fullresponse?: boolean;
  };

  export type enclose_item_in_collectionArgs = {
    key?: string;
    collection?: string;
    group_id?: string;
    title?: string;
  };

  export type get_doiArgs = ZoteroTypes.ItemArgs;

  export type manageLocalDBArgs = {
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
    verbose?: boolean;
    websocket?: boolean;
  };

  export type update_doiArgs = {
    key: string;
    doi?: string;
    zenodoRecordID?: string;
    fullresponse?: boolean;
    verbose?: boolean;
  };

  export type attach_linkArgs = {
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
    group_id?: string;
  };

  export type fieldArgs = ZoteroTypes.ItemArgs & {
    field: string;
    value?: string;
  };

  
  export interface tes extends fieldArgs {
    name: string;
    yes: boolean;
  }

  const tes: tes = {
    key: 'value',
    name: 'tes',
    yes: true,
    field: 'field',
  };
  export type update_urlArgs = ZoteroTypes.update_itemArgs & {
    value: string;
  };
}

export { ZoteroTypes };

//   public async XXX(args: ZoteroTypes.XXXArgs): Promise<any> {
