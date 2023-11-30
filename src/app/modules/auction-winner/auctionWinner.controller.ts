import { RequestHandler } from 'express';
import httpStatus from 'http-status';
import { paginationFields } from '../../../constants/paginationFields';
import ApiError from '../../../errors/ApiError';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { auctionWinnerFilterableFields } from './auctionWinner.constant';
import { AuctionWinnerServices } from './auctionWinner.service';

export const insertIntoDB: RequestHandler = catchAsync(async (req, res) => {
  const data = req.body;
  const result = await AuctionWinnerServices.insertIntoDB(data);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    status: 'success',
    message: 'Auction Winner created successfully',
    data: result,
  });
});

export const getAllFromDB: RequestHandler = catchAsync(
  async (req, res, next) => {
    const filters = pick(req.query, auctionWinnerFilterableFields);
    const paginationOptions = pick(req.query, paginationFields);

    const result = await AuctionWinnerServices.getAllFromDB(
      filters,
      paginationOptions
    );

    if (result.data.length === 0) {
      return next(
        new ApiError('No Auction Winner found!', httpStatus.NOT_FOUND)
      );
    }

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      status: 'success',
      message: 'Auction winner retrived successfully',
      meta: result.meta,
      data: result.data,
    });
  }
);

const getDataById: RequestHandler = catchAsync(async (req, res, next) => {
  const result = await AuctionWinnerServices.getDataById(req.params.id);

  if (!result) {
    return next(
      new ApiError(`No auction winner found with this id`, httpStatus.NOT_FOUND)
    );
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    status: 'success',
    message: 'Auction winner retrived successfully',
    data: result,
  });
});

const updateDataById: RequestHandler = catchAsync(async (req, res, next) => {
  const payload = req.body;

  const result = await AuctionWinnerServices.updateDataById(
    req.params.id,
    payload
  );

  if (!result) {
    return next(
      new ApiError(`No Auction winner found with this id`, httpStatus.NOT_FOUND)
    );
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    status: 'success',
    message: 'Auction winner updated successfully',
    data: result,
  });
});

const deleteDataById: RequestHandler = catchAsync(async (req, res, next) => {
  const result = await AuctionWinnerServices.deleteDataById(req.params.id);

  if (!result) {
    return next(
      new ApiError(`No auction winner found with this id`, httpStatus.NOT_FOUND)
    );
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    status: 'success',
    message: 'Auction winner deleted successfully',
    data: result,
  });
});

export const AuctionWinnerController = {
  insertIntoDB,
  getAllFromDB,
  getDataById,
  updateDataById,
  deleteDataById,
};
