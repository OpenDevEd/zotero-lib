import { Library, ResponseLinks } from './global';

export type CreateSearch = {
  successful: {
    [key: string]: Search;
  };
  success: {
    [key: string]: string;
  };
  unchanged: {
    [key: string]: string;
  };
  failed: {
    [key: string]: string;
  };
};

// Search Type

export type Search = {
  key: string;
  version: number;
  library: Library;
  links: ResponseLinks;
  data: SearchData;
};

type SearchData = {
  key: string;
  version: number;
  name: string;
  conditions: Condition[];
};

type Condition = {
  condition: string;
  operator: string;
  value: string;
};
