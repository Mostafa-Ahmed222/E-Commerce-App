import joi from "joi";

export const createOrder = {
  body: joi
    .object()
    .required()
    .keys({
      products: joi.array().items(joi.object().keys({
        productId: joi.string().pattern(new RegExp(/^[a-fA-F0-9]{24}$/)).required(),
        quantity: joi.number().default(1).min(1)
      })).required(),
      address: joi.string().min(2).required(),
      phone: joi.string().min(11).max(11).required(),
      address: joi.string().min(2).required(),
      couponId: joi.string().pattern(new RegExp(/^[a-fA-F0-9]{24}$/)),
    }),
  headers: joi
    .object()
    .required()
    .keys({
      authorization: joi.string().required(),
    })
    .options({ allowUnknown: true }),
};

export const updateOrder = {
  params : joi.object().required().keys({
    id: joi.string().pattern(new RegExp(/^[a-fA-F0-9]{24}$/)).required(),
  }),
  body: joi
    .object()
    .required()
    .keys({
      products: joi.array().items(joi.object().keys({
        productId: joi.string().pattern(new RegExp(/^[a-fA-F0-9]{24}$/)),
        quantity: joi.number().default(1).min(1)
      })),
      address: joi.string().min(2),
      phone: joi.string().min(11).max(11),
      address: joi.string().min(2),
      couponId: joi.string().pattern(new RegExp(/^[a-fA-F0-9]{24}$/)),
    }),
  headers: joi
    .object()
    .required()
    .keys({
      authorization: joi.string().required(),
    })
    .options({ allowUnknown: true }),
};
export const deleteOrder = {
  params : joi.object().required().keys({
    id: joi.string().pattern(new RegExp(/^[a-fA-F0-9]{24}$/)).required(),
  }),
  headers: joi
    .object()
    .required()
    .keys({
      authorization: joi.string().required(),
    })
    .options({ allowUnknown: true }),
};
export const getOrder = {
  headers: joi
    .object()
    .required()
    .keys({
      authorization: joi.string().required(),
    })
    .options({ allowUnknown: true }),
};
