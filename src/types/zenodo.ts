export type Zenodo = {
  id: string;
  title: string;
  description: string;
  authors: { name: string }[];
  publication_date: string;
};
