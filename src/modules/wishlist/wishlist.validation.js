import joi from 'joi';

export const add = {
    params : joi.object().required().keys({
      productId: joi.string().pattern(new RegExp(/^[a-fA-F0-9]{24}$/)).required(),
    }),
    headers: joi.object().required().keys({
      authorization: joi.string().required()
    }).options({allowUnknown : true})
  }
export const remove = {
    params : joi.object().required().keys({
      productId: joi.string().pattern(new RegExp(/^[a-fA-F0-9]{24}$/)).required(),
    }),
    headers: joi.object().required().keys({
      authorization: joi.string().required()
    }).options({allowUnknown : true})
  }