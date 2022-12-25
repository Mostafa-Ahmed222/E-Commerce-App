import joi from "joi";

export const addToCart = {
  body: joi
    .object()
    .required()
    .keys({
      products: joi.array().items(joi.object().keys({
        productId: joi.string().pattern(new RegExp(/^[a-fA-F0-9]{24}$/)).required(),
        quantity: joi.number().min(1)
      }))
    }),
  headers: joi
    .object()
    .required()
    .keys({
      authorization: joi.string().required(),
    })
    .options({ allowUnknown: true }),
};

export const removeFromCart = {
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
export const getCart = {
  headers: joi
    .object()
    .required()
    .keys({
      authorization: joi.string().required(),
    })
    .options({ allowUnknown: true }),
};
