import joi from "joi";

export const addProduct = {
  body: joi.object().required().keys({
    name: joi.string().required(),
    description: joi.string().required(),
    startStock: joi.number().min(0).required(),
    price: joi.number().min(0).required(),
    discount: joi.number().min(0),
    colors: joi.array().items(joi.string()),
    sizes: joi.array().items(joi.string().valid('sm', 'l', 'xl')),
    categoryId: joi.string().pattern(new RegExp(/^[a-fA-F0-9]{24}$/)).required(),
    subCategoryId: joi.string().pattern(new RegExp(/^[a-fA-F0-9]{24}$/)).required(),
    brandId: joi.string().pattern(new RegExp(/^[a-fA-F0-9]{24}$/)).required(),
  }),
  headers: joi.object().required().keys({
    authorization: joi.string().required()
  }).options({allowUnknown : true})
};
export const updateProduct = {
  body: joi.object().required().keys({
    name: joi.string(),
    description: joi.string(),
    startStock: joi.number().min(0),
    price: joi.number().min(0),
    discount: joi.number().min(0),
    publicImageIds: joi.array().items(joi.string()),
    colors: joi.array().items(joi.string()),
    sizes: joi.array().items(joi.string().valid('sm', 'l', 'xl')),
  }),
  params : joi.object().required().keys({
    id: joi.string().pattern(new RegExp(/^[a-fA-F0-9]{24}$/)).required(),
  }),
  headers: joi.object().required().keys({
    authorization: joi.string().required()
  }).options({allowUnknown : true})
}
export const getProducts = {
  headers: joi.object().required().keys({
    authorization: joi.string().required()
  }).options({allowUnknown : true})
}
export const getProduct = {
  params : joi.object().required().keys({
    id: joi
        .string()
        .pattern(new RegExp(/^[a-fA-F0-9]{24}$/))
        .required(),
  }),
  headers: joi.object().required().keys({
    authorization: joi.string().required()
  }).options({allowUnknown : true})
}