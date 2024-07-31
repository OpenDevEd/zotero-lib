import { GroupData } from './group';

export type KeyInfo = {
  key: string;
  userID: number;
  username: string;
  displayName: string;
  access: Access;
};

type AccessRights = {
  library: boolean;
  write: boolean;
};

type AccessUser = {
  library: boolean;
  files: boolean;
};

type Access = {
  user: AccessUser;
  groups: {
    [key: string]: AccessRights;
  };
};

export type KeyReturn = {
  key: KeyInfo;
  groups: GroupData[];
};
