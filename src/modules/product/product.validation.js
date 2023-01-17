import joi from "joi";

export const addProduct = {
  body: joi.object().required().keys({
    name: joi.string().required(),
    description: joi.string().required(),
    amount: joi.number().min(0).required(),
    price: joi.number().min(0).required(),
    discount: joi.number().min(0).max(100),
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
    amount: joi.number().min(0),
    price: joi.number().min(0),
    discount: joi.number().min(0).max(100),
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
  query: joi.object().required().keys({
    page: joi.number(),
    size: joi.number(),
    sortedField: joi.string(),
    orderedBy: joi.number().valid(1, -1)
  })
}

export const getProductById = {
  params : joi.object().required().keys({
    id: joi
        .string()
        .pattern(new RegExp(/^[a-fA-F0-9]{24}$/))
        .required(),
  }),
}