import { Prisma, ProductCategory } from '@prisma/client';
import { calculatePagination } from '../../../helpers/paginationHelper';
import { IGenericPaginationResponse } from '../../../interfaces/genericPaginationResponse';
import { IpaginationOptions } from '../../../interfaces/paginationOptions';
import { findFilterConditionsWithoutRelation } from '../../../shared/findFilterConditions';
import { orderByConditions } from '../../../shared/orderCondition';
import prisma from '../../../shared/prisma';
import { categorySearchableFields } from './category.constant';
import { ICategoryFilters } from './category.interface';

const insertIntoDB = async (
  data: ProductCategory
): Promise<ProductCategory> => {
  const result = await prisma.productCategory.create({
    data,
  });
  return result;
};

const getAllFromDB = async (
  filters: ICategoryFilters,
  options: IpaginationOptions
): Promise<IGenericPaginationResponse<ProductCategory[]>> => {
  const { page, limit, skip } = calculatePagination(options);
  const { searchTerm, ...filterData } = filters;

  const andConditions = findFilterConditionsWithoutRelation(
    searchTerm,
    filterData,
    categorySearchableFields
  );

  const whereConditons: Prisma.ProductCategoryWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const orderCondition = orderByConditions(options);

  const result = await prisma.productCategory.findMany({
    where: whereConditons,
    skip,
    take: limit,
    orderBy: orderCondition,
    include: {
      products: {},
    },
  });

  const total = await prisma.productCategory.count();

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getDataById = async (id: string): Promise<ProductCategory | null> => {
  const result = await prisma.productCategory.findUnique({
    where: {
      id,
    },
    include: {
      products: {},
    },
  });
  return result;
};

const updateDataById = async (
  id: string,
  payload: Partial<ProductCategory>
): Promise<ProductCategory> => {
  const result = await prisma.productCategory.update({
    where: {
      id,
    },
    data: payload,
    include: {
      products: {},
    },
  });

  return result;
};

const deleteDataById = async (id: string): Promise<ProductCategory> => {
  const result = await prisma.productCategory.delete({
    where: {
      id,
    },
  });

  return result;
};

export const CategoryServices = {
  insertIntoDB,
  getAllFromDB,
  getDataById,
  updateDataById,
  deleteDataById,
};
