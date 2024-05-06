export namespace ZoteroResponse {
  export interface Items {
    key: string;
    version: number;
    itemType?: string;
    title?: string;
    parentItem?: string;
    abstractNote?: string;
    artworkMedium?: string;
    artworkSize?: string;
    date?: string;
    language?: string;
    shortTitle?: string;
    archive?: string;
    archiveLocation?: string;
    libraryCatalog?: string;
    callNumber?: string;
    url?: string;
    accessDate?: string;
    rights?: string;
    extra?: string;
    audioRecordingFormat?: string;
    seriesTitle?: string;
    volume?: string;
    numberOfVolumes?: string;
    place?: string;
    label?: string;
    runningTime?: string;
    ISBN?: string;
    billNumber?: string;
    code?: string;
    codeVolume?: string;
    section?: string;
    codePages?: string;
    legislativeBody?: string;
    session?: string;
    history?: string;
    blogTitle?: string;
    websiteType?: string;
    series?: string;
    seriesNumber?: string;
    edition?: string;
    publisher?: string;
    numPages?: string;
    bookTitle?: string;
    pages?: string;
    caseName?: string;
    court?: string;
    dateDecided?: string;
    docketNumber?: string;
    reporter?: string;
    reporterVolume?: string;
    firstPage?: string;
    proceedingsTitle?: string;
    conferenceName?: string;
    DOI?: string;
    identifier?: string;
    type?: string;
    number?: string;
    versionNumber?: string;
    repository?: string;
    repositoryLocation?: string;
    format?: string;
    citationKey?: string;
    dictionaryTitle?: string;
    subject?: string;
    encyclopediaTitle?: string;
    distributor?: string;
    genre?: string;
    videoRecordingFormat?: string;
    forumTitle?: string;
    postType?: string;
    committee?: string;
    documentNumber?: string;
    interviewMedium?: string;
    publicationTitle?: string;
    issue?: string;
    seriesText?: string;
    journalAbbreviation?: string;
    ISSN?: string;
    letterType?: string;
    manuscriptType?: string;
    mapType?: string;
    scale?: string;
    note?: string;
    country?: string;
    assignee?: string;
    issuingAuthority?: string;
    patentNumber?: string;
    filingDate?: string;
    applicationNumber?: string;
    priorityNumbers?: string;
    issueDate?: string;
    references?: string;
    legalStatus?: string;
    episodeNumber?: string;
    audioFileType?: string;
    archiveID?: string;
    presentationType?: string;
    meetingName?: string;
    programTitle?: string;
    network?: string;
    reportNumber?: string;
    reportType?: string;
    institution?: string;
    system?: string;
    company?: string;
    programmingLanguage?: string;
    organization?: string;
    status?: string;
    nameOfAct?: string;
    codeNumber?: string;
    publicLawNumber?: string;
    dateEnacted?: string;
    thesisType?: string;
    university?: string;
    studio?: string;
    websiteTitle?: string;
    tags: ItemTags[];
    inconsistent: boolean;
    group_id: number;
    group: Groups;
    relations: RelationsItems[];
    deleted: boolean;
    collectionItems: CollectionItems[];
    alsoKnownAs: AlsoKnownAs[];
    numChildren?: number;

    zoteroAuthorCreator?: ZoteroAuthor;
    authorsItems: AuthorsItems[];
  }

  export interface Tags {
    tagName: string;
    itemTags: ItemTags[];
  }

  export interface ItemTags {
    tag: Tags;
    item: Items;
  }

  export interface Groups {
    id: number;
    name: string;
    version: number;
    itemsVersion: number;
    owner: ZoteroAuthor;
    type: string;
    description?: string;
    url?: string;
    libraryEditing?: string;
    libraryReading?: string;
    fileEditing?: string;
    groupMembers: GroupsMembers[];
    GroupAdmins: GroupsAdmins[];
    createdAtZotero: Date;
    lastModifiedZotero: Date;
    numItems: number;
    items: Items[];
    alsoKnownAs: AlsoKnownAs[];
    relations: RelationsItems[];
    collectionGroups: CollectionItems[];
    authorsItems: AuthorsItems[];
    authors: Authors[];
  }

  export interface Relations {
    relation: string;
    relationType: string;
    relationItem: RelationsItems;
  }

  export interface RelationsItems {
    relation: Relations;
    item: Items;
    group: Groups;
  }

  export interface Collections {
    key: string;
    version: number;
    name: string;
    parentCollection?: string;
    numCollections: number;
    numItems: number;
    collection_items: CollectionItems[];
  }

  export interface CollectionItems {
    collection: Collections;
    item: Items;
    group: Groups;
  }

  export interface AlsoKnownAs {
    item: Items;
    group: Groups;
    data: string;
    reference: string[];
    isAmbiguous: boolean;
  }

  export interface ZoteroAuthor {
    id: number;
    username?: string;
    name?: string;
    items: Items[];
    groups: Groups[];
    groupMembers: GroupsMembers[];
    groupAdmins: GroupsAdmins[];
  }

  export interface AuthorsItems {
    item: Items;
    author: Authors;
    groups: Groups;
  }

  export interface Authors {
    name?: string;
    creatorType?: string;
    group: Groups;
    authorItems: AuthorsItems[];
  }

  export interface GroupsMembers {
    group: Groups;
    author: ZoteroAuthor;
  }

  export interface GroupsAdmins {
    group: Groups;
    author: ZoteroAuthor;
  }
}
