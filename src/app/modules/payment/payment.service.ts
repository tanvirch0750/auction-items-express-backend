import { Payment } from '@prisma/client';
import { calculatePagination } from '../../../helpers/paginationHelper';
import { IGenericPaginationResponse } from '../../../interfaces/genericPaginationResponse';
import { IpaginationOptions } from '../../../interfaces/paginationOptions';
import { orderByConditions } from '../../../shared/orderCondition';
import prisma from '../../../shared/prisma';

const insertIntoDB = async (data: Payment): Promise<Payment> => {
  const result = await prisma.payment.create({
    data,
  });
  return result;
};

const getAllFromDB = async (
  options: IpaginationOptions
): Promise<IGenericPaginationResponse<Payment[]>> => {
  const { page, limit, skip } = calculatePagination(options);

  const orderCondition = orderByConditions(options);

  const result = await prisma.payment.findMany({
    skip,
    take: limit,
    orderBy: orderCondition,
    include: {
      auctionWinner: true,
    },
  });

  const total = await prisma.payment.count();

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getDataById = async (id: string): Promise<Payment | null> => {
  const result = await prisma.payment.findUnique({
    where: {
      id,
    },
    include: {
      auctionWinner: true,
    },
  });
  return result;
};

const updateDataById = async (
  id: string,
  payload: Partial<Payment>
): Promise<Payment> => {
  const result = await prisma.payment.update({
    where: {
      id,
    },
    data: payload,
    include: {
      auctionWinner: true,
    },
  });

  return result;
};

const deleteDataById = async (id: string): Promise<Payment> => {
  const result = await prisma.payment.delete({
    where: {
      id,
    },
  });

  return result;
};

export const PaymentServices = {
  insertIntoDB,
  getAllFromDB,
  getDataById,
  updateDataById,
  deleteDataById,
};
