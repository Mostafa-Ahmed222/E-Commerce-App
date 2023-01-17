import joi from "joi";

export const addCategory = {
  body: joi.object().required().keys({
    name: joi.string().required()
  }),
  headers: joi.object().required().keys({
    authorization: joi.string().required()
  }).options({allowUnknown : true})
};
export const updateCategory = {
  body: joi.object().required().keys({
    name: joi.string()
  }),
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
export const getCategories = {
  query: joi.object().required().keys({
    page: joi.number().min(1),
    size: joi.number().min(1),
    sortedField: joi.string(),
    orderedBy: joi.number().valid(1, -1)
  }),
}
export const getCategoryById = {
  params : joi.object().required().keys({
    id: joi
        .string()
        .pattern(new RegExp(/^[a-fA-F0-9]{24}$/))
        .required(),
  }),
}