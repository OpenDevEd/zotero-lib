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
  links: {
    self: LinkType;
  };
  data: SearchData;
};

type Library = {
  type: string;
  id: number;
  name: string;
  links: {
    alternate: LinkType;
  };
};

type LinkType = {
  href: string;
  type: string;
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
