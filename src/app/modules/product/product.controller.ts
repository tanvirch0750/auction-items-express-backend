import { RequestHandler } from 'express';
import httpStatus from 'http-status';

import { paginationFields } from '../../../constants/paginationFields';
import ApiError from '../../../errors/ApiError';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { productFilterableFields } from './product.constant';
import { ProductServices } from './product.service';

export const insertIntoDB: RequestHandler = catchAsync(async (req, res) => {
  const data = req.body;
  const result = await ProductServices.insertIntoDB(data);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    status: 'success',
    message: 'Product created successfully',
    data: result,
  });
});

export const getAllFromDB: RequestHandler = catchAsync(
  async (req, res, next) => {
    const filters = pick(req.query, productFilterableFields);
    const paginationOptions = pick(req.query, paginationFields);

    const result = await ProductServices.getAllFromDB(
      filters,
      paginationOptions
    );

    if (result.data.length === 0) {
      return next(new ApiError('No product found!', httpStatus.NOT_FOUND));
    }

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      status: 'success',
      message: 'Product retrived successfully',
      meta: result.meta,
      data: result.data,
    });
  }
);

const getDataById: RequestHandler = catchAsync(async (req, res, next) => {
  const result = await ProductServices.getDataById(req.params.id);

  if (!result) {
    return next(
      new ApiError(`No product found with this id`, httpStatus.NOT_FOUND)
    );
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    status: 'success',
    message: 'Product retrived successfully',
    data: result,
  });
});

const updateDataById: RequestHandler = catchAsync(async (req, res, next) => {
  const payload = req.body;

  const result = await ProductServices.updateDataById(req.params.id, payload);

  if (!result) {
    return next(
      new ApiError(`No product found with this id`, httpStatus.NOT_FOUND)
    );
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    status: 'success',
    message: 'Product updated successfully',
    data: result,
  });
});

const startBidding: RequestHandler = catchAsync(async (req, res, next) => {
  const result = await ProductServices.startBidding(req.params.id);

  if (!result) {
    return next(
      new ApiError(`No product found with this id`, httpStatus.NOT_FOUND)
    );
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    status: 'success',
    message: 'Bidding start',
    data: result,
  });
});

const endBidding: RequestHandler = catchAsync(async (req, res, next) => {
  const result = await ProductServices.endBidding(req.params.id);

  if (!result) {
    return next(
      new ApiError(`No product found with this id`, httpStatus.NOT_FOUND)
    );
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    status: 'success',
    message: 'Bidding end',
    data: result,
  });
});

const deleteDataById: RequestHandler = catchAsync(async (req, res, next) => {
  const result = await ProductServices.deleteDataById(req.params.id);

  if (!result) {
    return next(
      new ApiError(`No product found with this id`, httpStatus.NOT_FOUND)
    );
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    status: 'success',
    message: 'Product deleted successfully',
    data: result,
  });
});

const getProductByCategory: RequestHandler = catchAsync(async (req, res) => {
  const result = await ProductServices.getDataByCategory(req.params.categoryId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    status: 'success',
    message: 'Product retrived successfully',
    data: result,
  });
});

export const ProductController = {
  insertIntoDB,
  getAllFromDB,
  getDataById,
  updateDataById,
  deleteDataById,
  getProductByCategory,
  startBidding,
  endBidding,
};
