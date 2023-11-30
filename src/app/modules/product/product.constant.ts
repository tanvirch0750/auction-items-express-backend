export const productSearchableFields = ['productName'];

export const productFilterableFields = [
  'searchTerm',
  'categoryId',
  'minPrice',
  'maxPrice',
];

export const productRelationalFields: string[] = ['categoryId'];

export const productRelationalFieldsMapper: { [key: string]: string } = {
  categoryId: 'category',
};

export type IProductFilters = {
  searchTerm?: string;
  categoryId?: string;
};
