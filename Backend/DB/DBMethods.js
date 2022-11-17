// Creating
export const createAndSave = async (model, data = {}) => {
  const result = await model(data);
  return result;
};

export const create = async (model, data = {}) => {
  const result = await model.create(data);
  return result;
};

export const insertMany = async (model, data = []) => {
  const result = await model.insertMany(data);
  return result;
};

// Finding
export const find = async (model,condition = {},select = "",populate = [],skip = 0,limit = 20) => {
  const result = await model.find(condition).limit(limit).skip(skip).select(select).populate(populate);
  return result;
};

export const findById = async(model,condition = {},select = "",populate = [])=>{
  const result = await model.findById(condition).select(select).populate(populate);
  return result;
}

export const findOne = async(model,condition = {},select = "",populate = [])=>{
  const result = await model.findOne(condition).select(select).populate(populate);
  return result;
}

// Updating
export const updateOne = async(model, condition={}, data={})=>{
  const result = await model.updateOne(condition, data)
  return result
}

export const updateMany = async(model, condition={}, data=[])=>{
  const result = await model.updateMany(condition, data)
  return result
}

export const findByIdAndUpdate = async(model, condition={}, data={}, options={}, select = "", populate = [])=>{
  const result = await model.findByIdAndUpdate(condition, data, options).select(select).populate(populate)
  return result
}

export const findOneAndUpdate = async(model, condition={}, data={}, options={}, select = "", populate = [])=>{
  const result = await model.findOneAndUpdate(condition, data, options).select(select).populate(populate)
  return result
}

// Deleting
export const DeleteOne = async(model, condition={})=>{
  const result = await model.DeleteOne(condition)
  return result
}

export const DeleteMany = async(model, condition={}, )=>{
  const result = await model.DeleteMany(condition)
  return result
}

export const findByIdAndDelete = async(model, condition={}, select = "", populate = [])=>{
  const result = await model.findByIdAndDelete(condition).select(select).populate(populate)
  return result
}

export const findOneAndDelete = async(model, condition={}, select = "", populate = [])=>{
  const result = await model.findOneAndDelete(condition).select(select).populate(populate)
  return result
}

// Removing
export const findByIdAndRemove = async(model, condition={}, select = "", populate = [])=>{
  const result = await model.findByIdAndRemove(condition).select(select).populate(populate)
  return result
}

export const findOneAndRemove = async(model, condition={}, select = "", populate = [])=>{
  const result = await model.findOneAndRemove(condition).select(select).populate(populate)
  return result
}

