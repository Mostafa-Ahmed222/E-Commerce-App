import joi from "joi";

export const createCoupon = {
  body: joi
    .object()
    .required()
    .keys({
      name: joi.string().required(),
      amount: joi.number().min(0).max(100).required(),
      expireDate: joi
        .string()
        .required(),
    }),
  headers: joi
    .object()
    .required()
    .keys({
      authorization: joi.string().required(),
    })
    .options({ allowUnknown: true }),
};
export const updateCoupon = {
  params : joi.object().required().keys({
    id: joi.string().pattern(new RegExp(/^[a-fA-F0-9]{24}$/)).required(),
  }),
  body: joi
    .object()
    .required()
    .keys({
      name: joi.string(),
      amount: joi.number().min(0).max(100),
      expireDate: joi
        .string()
    }),
  headers: joi
    .object()
    .required()
    .keys({
      authorization: joi.string().required(),
    })
    .options({ allowUnknown: true }),
};
export const deleteCoupon = {
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
export const getCoupons = {
  headers: joi
    .object()
    .required()
    .keys({
      authorization: joi.string().required(),
    })
    .options({ allowUnknown: true }),
};
export const getCoupon = {
  params: joi
    .object()
    .required()
    .keys({
      name: joi.string().required(),
    }),
  headers: joi
    .object()
    .required()
    .keys({
      authorization: joi.string().required(),
    })
    .options({ allowUnknown: true }),
};
