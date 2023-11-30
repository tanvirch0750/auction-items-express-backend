import { z } from 'zod';

const create = z.object({
  body: z.object({
    productName: z.string({
      required_error: 'Service Name is required',
    }),
    description: z.string({
      required_error: 'Description is required',
    }),
    imageUrl: z.string({
      required_error: 'Image URL is required',
    }),
    auctionDate: z.string({
      required_error: 'Auction Date is required',
    }),
    auctionTime: z.string({
      required_error: 'Auction Date is required',
    }),
    auctionStatus: z.string({
      required_error: 'Auction Status is required',
    }),
    initialBiddingPrice: z.number({
      required_error: 'Initial bidding price is required',
    }),
    currentBiddingPrice: z.number({
      required_error: 'Current bidding price is required',
    }),
    incrementAmount: z.number({
      required_error: 'Increment amount price is required',
    }),
    categoryId: z.string({
      required_error: 'Category ID is required',
    }),
    productOwnerId: z.string({
      required_error: 'Product owner ID is required',
    }),
  }),
});

const update = z.object({
  body: z.object({
    serviceName: z.string().optional(),
    description: z.string().optional(),
    price: z.number().optional(),
    imageUrl: z.string().optional(),
    serviceCategoryId: z.string(),
  }),
});

export const validationSchema = {
  create,
  update,
};
