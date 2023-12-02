import { AuctionWinner, Prisma } from '@prisma/client';
import { calculatePagination } from '../../../helpers/paginationHelper';
import { IGenericPaginationResponse } from '../../../interfaces/genericPaginationResponse';
import { IpaginationOptions } from '../../../interfaces/paginationOptions';
import { findFilterConditionsWithoutRelation } from '../../../shared/findFilterConditions';
import { orderByConditions } from '../../../shared/orderCondition';
import prisma from '../../../shared/prisma';
import {
  IAuctionWinnerFilters,
  auctionWinnerSearchableFields,
} from './auctionWinner.constant';

const insertIntoDB = async (data: AuctionWinner) => {
  //   const result = await prisma.auctionWinner.create({
  //     data,
  //   });

  const winner = await prisma.$transaction(async transactionClient => {
    const aw = await transactionClient.auctionWinner.create({
      data,
      include: {
        payment: true,
        auctionWinner: true,
        product: true,
      },
    });

    // console.log(aw);

    // const payment = await transactionClient.payment.create({
    //   data: {
    //     auctionWinnerId: aw.auctionWinnerId,
    //   },
    // });

    return {
      auctionWinner: aw,
    };
  });

  return winner;
};

const getAllFromDB = async (
  filters: IAuctionWinnerFilters,
  options: IpaginationOptions
): Promise<IGenericPaginationResponse<AuctionWinner[]>> => {
  const { page, limit, skip } = calculatePagination(options);
  const { searchTerm, ...filterData } = filters;

  const andConditions = findFilterConditionsWithoutRelation(
    searchTerm,
    filterData,
    auctionWinnerSearchableFields
  );

  const whereConditons: Prisma.AuctionWinnerWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const orderCondition = orderByConditions(options);

  const result = await prisma.auctionWinner.findMany({
    where: whereConditons,
    skip,
    take: limit,
    orderBy: orderCondition,
    include: {
      product: true,
      payment: true,
      auctionWinner: true,
    },
  });

  const total = await prisma.auctionWinner.count();

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getDataById = async (id: string): Promise<AuctionWinner | null> => {
  const result = await prisma.auctionWinner.findUnique({
    where: {
      id,
    },
    include: {
      auctionWinner: true,
      payment: true,
      product: true,
    },
  });
  return result;
};

const updateDataById = async (
  id: string,
  payload: Partial<AuctionWinner>
): Promise<AuctionWinner> => {
  const result = await prisma.auctionWinner.update({
    where: {
      id,
    },
    data: payload,
    include: {
      auctionWinner: true,
      payment: true,
      product: true,
    },
  });

  return result;
};

const deleteDataById = async (id: string): Promise<AuctionWinner> => {
  const result = await prisma.auctionWinner.delete({
    where: {
      id,
    },
  });

  return result;
};

export const AuctionWinnerServices = {
  insertIntoDB,
  getAllFromDB,
  getDataById,
  updateDataById,
  deleteDataById,
};
