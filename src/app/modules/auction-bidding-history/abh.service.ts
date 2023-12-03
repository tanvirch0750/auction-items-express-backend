/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { AuctionBiddingHistory, Prisma } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { calculatePagination } from '../../../helpers/paginationHelper';
import { IGenericPaginationResponse } from '../../../interfaces/genericPaginationResponse';
import { IpaginationOptions } from '../../../interfaces/paginationOptions';
import { io } from '../../../server';
import { findFilterConditionsWithoutRelation } from '../../../shared/findFilterConditions';
import { orderByConditions } from '../../../shared/orderCondition';
import prisma from '../../../shared/prisma';
import { IAbhFilters, abhSearchableFields } from './abh.constant';

const insertIntoDB = async (data: AuctionBiddingHistory) => {
  const product = await prisma.product.findUnique({
    where: {
      id: data?.productId,
    },
  });

  if (!product) {
    throw new ApiError(`No product found with this id`, httpStatus.NOT_FOUND);
  }

  const result = await prisma.$transaction(async transactionClient => {
    const abh = await transactionClient.auctionBiddingHistory.create({
      data: {
        productId: product?.id,
        bidderId: data?.bidderId,
        amount: product?.currentBiddingPrice + product?.incrementAmount,
      },
      include: {
        bidder: true,
        product: true,
      },
    });

    const productUpdate = await transactionClient.product.update({
      where: {
        id: abh.productId,
      },
      data: {
        currentBiddingPrice: abh?.amount,
      },
      include: {
        category: true,
        productOwner: true,
        auctionWinner: true,
        auctionBiddingHistory: true,
        messages: true,
      },
    });

    // Emit a bid update event to all connected clients
    io.emit('bidUpdate', abh);

    return {
      abh,
    };
  });

  // const result = await prisma.auctionBiddingHistory.create({
  //   data,
  // });
  return result;
};

const getAllFromDB = async (
  filters: IAbhFilters,
  options: IpaginationOptions
): Promise<IGenericPaginationResponse<AuctionBiddingHistory[]>> => {
  const { page, limit, skip } = calculatePagination(options);
  const { searchTerm, ...filterData } = filters;

  const andConditions = findFilterConditionsWithoutRelation(
    searchTerm,
    filterData,
    abhSearchableFields
  );

  const whereConditons: Prisma.AuctionBiddingHistoryWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const orderCondition = orderByConditions(options);

  const result = await prisma.auctionBiddingHistory.findMany({
    where: whereConditons,
    skip,
    take: limit,
    orderBy: orderCondition,
    include: {
      product: true,
      bidder: true,
    },
  });

  const total = await prisma.auctionBiddingHistory.count();

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getDataById = async (
  id: string
): Promise<AuctionBiddingHistory | null> => {
  const result = await prisma.auctionBiddingHistory.findUnique({
    where: {
      id,
    },
    include: {
      product: true,
      bidder: true,
    },
  });
  return result;
};

const updateDataById = async (
  id: string,
  payload: Partial<AuctionBiddingHistory>
): Promise<AuctionBiddingHistory> => {
  const result = await prisma.auctionBiddingHistory.update({
    where: {
      id,
    },
    data: payload,
    include: {
      product: true,
      bidder: true,
    },
  });

  return result;
};

const deleteDataById = async (id: string): Promise<AuctionBiddingHistory> => {
  const result = await prisma.auctionBiddingHistory.delete({
    where: {
      id,
    },
  });

  return result;
};

export const AbhServices = {
  insertIntoDB,
  getAllFromDB,
  getDataById,
  updateDataById,
  deleteDataById,
};
