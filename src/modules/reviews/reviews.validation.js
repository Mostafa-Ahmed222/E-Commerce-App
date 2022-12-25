import joi from "joi";

export const addReview = {
    params : joi.object().required().keys({
      productId: joi.string().pattern(new RegExp(/^[a-fA-F0-9]{24}$/)).required(),
    }),
  body: joi
    .object()
    .required()
    .keys({
      message: joi.string().min(2).required(),
      rating: joi.number().positive().min(1).max(5).required(),
    }),
  headers: joi
    .object()
    .required()
    .keys({
      authorization: joi.string().required(),
    })
    .options({ allowUnknown: true }),
};

export const updateReview = {
  params : joi.object().required().keys({
    id: joi.string().pattern(new RegExp(/^[a-fA-F0-9]{24}$/)).required(),
  }),
  body: joi
    .object()
    .required()
    .keys({
      message: joi.string().min(2),
      rating: joi.number().positive().min(1).max(5),
    }),
  headers: joi
    .object()
    .required()
    .keys({
      authorization: joi.string().required(),
    })
    .options({ allowUnknown: true }),
};
export const deleteReview = {
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
