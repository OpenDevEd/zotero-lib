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
