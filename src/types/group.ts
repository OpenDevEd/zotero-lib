import { ResponseLinks } from './global';

export type GroupResponse = {
  id: number;
  version: number;
  links: ResponseLinks;
  meta: Meta;
  data: GroupData;
};

type Meta = {
  created: string;
  lastModified: string;
  numItems: number;
};

export type GroupData = {
  id: number;
  version: number | string;
  name: string;
  owner?: number;
  type?: string;
  description?: string;
  url?: string;
  libraryEditing?: string;
  libraryReading?: string;
  fileEditing?: string;
  members?: number[];
};
