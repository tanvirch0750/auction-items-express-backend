/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Prisma, Product } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { calculatePagination } from '../../../helpers/paginationHelper';

import { IGenericPaginationResponse } from '../../../interfaces/genericPaginationResponse';
import { IpaginationOptions } from '../../../interfaces/paginationOptions';
import { findFilterConditionsWithPrice } from '../../../shared/findFilterConditions';
import { orderByConditions } from '../../../shared/orderCondition';
import prisma from '../../../shared/prisma';
import {
  IProductFilters,
  productRelationalFields,
  productRelationalFieldsMapper,
  productSearchableFields,
} from './product.constant';

const insertIntoDB = async (data: Product): Promise<Product> => {
  const result = await prisma.product.create({
    data,
    include: {
      productOwner: true,
      category: true,
      auctionWinner: true,
      auctionBiddingHistory: true,
      messages: true,
    },
  });
  return result;
};

const getAllFromDB = async (
  filters: IProductFilters,
  options: IpaginationOptions
): Promise<IGenericPaginationResponse<Product[]>> => {
  const { page, limit, skip } = calculatePagination(options);
  const { searchTerm, ...filterData } = filters;

  const andConditions = findFilterConditionsWithPrice(
    searchTerm,
    filterData,
    productSearchableFields,
    productRelationalFields,
    productRelationalFieldsMapper
  );

  const whereConditons: Prisma.ProductWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const orderCondition = orderByConditions(options);

  const result = await prisma.product.findMany({
    include: {
      category: true,
      productOwner: true,
      auctionWinner: true,
      auctionBiddingHistory: true,
      messages: true,
    },
    where: whereConditons,
    skip,
    take: limit,
    orderBy: orderCondition,
  });

  const total = await prisma.product.count();

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getDataById = async (id: string): Promise<Product | null> => {
  const result = await prisma.product.findUnique({
    where: {
      id,
    },
    include: {
      category: true,
      productOwner: true,
      auctionWinner: true,
      auctionBiddingHistory: true,
      messages: true,
    },
  });
  return result;
};

const updateDataById = async (
  id: string,
  payload: Partial<Product>
): Promise<Product> => {
  const result = await prisma.product.update({
    where: {
      id,
    },
    data: payload,
    include: {
      category: true,
      productOwner: true,
      auctionWinner: true,
      auctionBiddingHistory: true,
      messages: true,
    },
  });

  return result;
};

const deleteDataById = async (id: string): Promise<Product> => {
  const result = await prisma.product.delete({
    where: {
      id,
    },
    include: {
      category: true,
      productOwner: true,
      auctionWinner: true,
      auctionBiddingHistory: true,
      messages: true,
    },
  });

  return result;
};

const getDataByCategory = async (categoryId: string): Promise<Product[]> => {
  const products = await prisma.product.findMany({
    include: {
      category: true,
      productOwner: true,
      auctionWinner: true,
      auctionBiddingHistory: true,
      messages: true,
    },
    where: {
      categoryId: categoryId,
    },
  });

  if (!products || products.length === 0) {
    throw new ApiError(
      'No products found for the specified category',
      httpStatus.NOT_FOUND
    );
  }

  return products;
};

const startBidding = async (id: string): Promise<Product> => {
  const result = await prisma.product.update({
    where: {
      id,
    },
    data: {
      auctionStatus: 'ongoing',
    },
    include: {
      category: true,
      productOwner: true,
      auctionWinner: true,
      auctionBiddingHistory: true,
      messages: true,
    },
  });

  return result;
};

const endBidding = async (id: string): Promise<Product> => {
  const result = await prisma.product.update({
    where: {
      id,
    },
    data: {
      auctionStatus: 'end',
    },
    include: {
      category: true,
      productOwner: true,
      auctionWinner: true,
      auctionBiddingHistory: true,
      messages: true,
    },
  });

  return result;
};

export const ProductServices = {
  insertIntoDB,
  getAllFromDB,
  getDataById,
  updateDataById,
  deleteDataById,
  getDataByCategory,
  startBidding,
  endBidding,
};
