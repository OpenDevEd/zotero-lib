export interface RequestArgs {
  api_key?: string;
  user_id?: string;
  group_id?: string;
}

export interface ZoteroGroup {
  id: number;
  version: number;
  itemsVersion: number;
  data: string;
  createdAt: string;
  updatedAt: string;
}

export interface ZoteroItem {
  key: string;
  version: number;
  synced: boolean;
  data: string;
  createdAt: string;
  updatedAt: string;
}
