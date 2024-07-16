export type ItemArgs = {
  filter: any;
  json: string;
  count: boolean;
  validate: boolean;
  collection: string;
  top: boolean;
  tags: boolean;
  validate_with: string;
  show: boolean;
};

export type ValidateItemsArgs = {
  validate_with: string;
};

export type ItemReturn = {
  title?: string;
  collections?: any;
};

export type Item = {
  key: string;
  version: number;
  itemType: string;
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
  tags: Tag[];
  inconsistent: boolean;
  // group_id?: number;
  // group: Group;
  relations: Relation;
  created_at?: string;
  dateAdded?: string;
  dateModified?: string;
  updated_at?: string;
  deleted?: boolean;
  // collection_items: CollectionItem[];
  // alsoKnown_as: AlsoKnownAs[];
  numChildren?: number;
  creators?: Creator[];
  collections?: string[];
};

type Tag = {
  tag: string;
  type?: number;
};

type Relation = {
  [key: string]: string[] | string;
};

type Creator = {
  creatorType: string;
  name?: string;
  firstName?: string;
  lastName?: string;
};

export type ItemResponse = {
  key: string;
  version: number;
  library: Library;
  links: ItemLinks;
  meta: Meta;
  data: Item;
};

type Library = {
  type: string;
  id: number;
  name: string;
  links: LibraryLinks;
};

type LibraryLinks = {
  alternate: Alternate;
};

type Alternate = {
  href: string;
  type: string;
  up?: Alternate;
};

type ItemLinks = {
  self: Alternate;
  alternate: Alternate;
};

type Meta = {
  creatorSummary?: string;
  parsedDate?: string;
  numChildren?: number;
};

export type FullItemResponse = {
  status?: number;
  message?: string;
  output?: any;
  result?: ItemResponse;
  final?: any;
};
