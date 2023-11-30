import { Prisma, ProductMessage } from '@prisma/client';
import { calculatePagination } from '../../../helpers/paginationHelper';
import { IGenericPaginationResponse } from '../../../interfaces/genericPaginationResponse';
import { IpaginationOptions } from '../../../interfaces/paginationOptions';
import { findFilterConditionsWithoutRelation } from '../../../shared/findFilterConditions';
import { orderByConditions } from '../../../shared/orderCondition';
import prisma from '../../../shared/prisma';
import { IMessageFilters, messageSearchableFields } from './message.constant';

const insertIntoDB = async (data: ProductMessage): Promise<ProductMessage> => {
  const result = await prisma.productMessage.create({
    data,
  });
  return result;
};

const getAllFromDB = async (
  filters: IMessageFilters,
  options: IpaginationOptions
): Promise<IGenericPaginationResponse<ProductMessage[]>> => {
  const { page, limit, skip } = calculatePagination(options);
  const { searchTerm, ...filterData } = filters;

  const andConditions = findFilterConditionsWithoutRelation(
    searchTerm,
    filterData,
    messageSearchableFields
  );

  const whereConditons: Prisma.ProductMessageWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const orderCondition = orderByConditions(options);

  const result = await prisma.productMessage.findMany({
    where: whereConditons,
    skip,
    take: limit,
    orderBy: orderCondition,
    include: {
      product: true,
      sender: true,
    },
  });

  const total = await prisma.productMessage.count();

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getDataById = async (id: string): Promise<ProductMessage | null> => {
  const result = await prisma.productMessage.findUnique({
    where: {
      id,
    },
    include: {
      product: true,
      sender: true,
    },
  });
  return result;
};

const updateDataById = async (
  id: string,
  payload: Partial<ProductMessage>
): Promise<ProductMessage> => {
  const result = await prisma.productMessage.update({
    where: {
      id,
    },
    data: payload,
    include: {
      product: true,
      sender: true,
    },
  });

  return result;
};

const deleteDataById = async (id: string): Promise<ProductMessage> => {
  const result = await prisma.productMessage.delete({
    where: {
      id,
    },
  });

  return result;
};

export const MessageServices = {
  insertIntoDB,
  getAllFromDB,
  getDataById,
  updateDataById,
  deleteDataById,
};
