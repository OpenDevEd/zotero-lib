export type GroupResponse = {
  id: number;
  version: number;
  links: Link;
  meta: Meta;
  data: GroupData;
};

type LinkTyoe = {
  href: string;
  type: string;
};

type Link = {
  self: LinkTyoe;
  alternate: LinkTyoe;
};

type Meta = {
  created: string;
  lastModified: string;
  numItems: number;
};

export type GroupData = {
  id?: number;
  version?: number | string;
  name?: string;
  owner?: number;
  type?: string;
  description?: string;
  url?: string;
  libraryEditing?: string;
  libraryReading?: string;
  fileEditing?: string;
  members?: number[];
};
