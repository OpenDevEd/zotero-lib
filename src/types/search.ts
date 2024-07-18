export type CreateSearch = {
  successful: {
    [key: string]: {
      key: string;
      version: number;
      library: {
        type: string;
        id: number;
        name: string;
        links: {
          alternate: {
            href: string;
            type: string;
          };
        };
      };
      links: {
        self: {
          href: string;
          type: string;
        };
      };
      data: {
        key: string;
        version: number;
        name: string;
        conditions: {
          condition: string;
          operator: string;
          value: string;
        }[];
      };
    };
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
  library: {
    type: string;
    id: number;
    name: string;
    links: {
      alternate: {
        href: string;
        type: string;
      };
    };
  };
  links: {
    self: {
      href: string;
      type: string;
    };
  };
  data: {
    key: string;
    version: number;
    name: string;
    conditions: {
      condition: string;
      operator: string;
      value: string;
    }[];
  };
};
