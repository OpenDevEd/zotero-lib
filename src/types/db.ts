import { ItemResponse } from './item';

export type NewItemDB = {
  id: string;
  version: number;
  data: ItemResponse;
  group_id: number;
  createdAt: Date;
  updatedAt: Date;
  isDeleted?: boolean;
};

export type UpdateItemDB = {
  id: string;
  version: number;
  data: ItemResponse;
  updatedAt: Date;
  isDeleted?: boolean;
};

export type AlsoKnownAsDB = {
  item_id: string;
  group_id: number;
  id: string;
};

export type NewAlsoKnownAsDB = {
  item_id: string;
  group_id: number;
  data: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type UpdateAlsoKnownAsDB = {
  id: string;
  item_id: string;
  group_id: number;
  data: string;
  isDeleted: boolean;
  updatedAt: Date;
};
