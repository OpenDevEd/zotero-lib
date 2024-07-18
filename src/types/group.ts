export type GroupResponse = {
  id: number;
  version: number;
  links: {
    self: {
      href: string;
      type: string;
    };
    alternate: {
      href: string;
      type: string;
    };
  };
  meta: {
    created: string;
    lastModified: string;
    numItems: number;
  };
  data: {
    id: number;
    version: number;
    name: string;
    owner: number;
    type: string;
    description: string;
    url: string;
    libraryEditing: string;
    libraryReading: string;
    fileEditing: string;
    members: number[];
  };
};
