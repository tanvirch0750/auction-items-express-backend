import { z } from 'zod';

const create = z.object({
  body: z.object({
    content: z.string({
      required_error: 'Message is required',
    }),
    senderId: z.string({
      required_error: 'Sender Id is required',
    }),
    productId: z.string({
      required_error: 'Product Id is required',
    }),
  }),
});

export const validationSchema = {
  create,
};
