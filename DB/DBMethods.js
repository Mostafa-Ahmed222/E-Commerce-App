// Creating
export const createAndSave = async ({model, data = {}} = {}) => {
  const newObj = new model(data);
  const savedObj = await newObj.save()
  return savedObj;
};

export const create = async ({model, data = {}} = {}) => {
  const result = await model.create(data);
  return result;
};

export const insertMany = async ({model, data = []} = {}) => {
  const result = await model.insertMany(data);
  return result;
};

// Finding
export const find = async ({model,filter = {},select = "",populate = [],skip = 0,limit = 20} = {}) => {
  const result = await model.find(filter).limit(limit).skip(skip).select(select).populate(populate);
  return result;
};

export const findById = async({model,filter = {},select = "",populate = []}={})=>{
  const result = await model.findById(filter).select(select).populate(populate);
  return result;
}

export const findOne = async({model,filter = {},select = "",populate = []}={})=>{
  const result = await model.findOne(filter).select(select).populate(populate);
  return result;
}

// Updating
export const updateOne = async({model, filter={}, data={}}= {})=>{
  const result = await model.updateOne(filter, data)
  return result
}

export const updateMany = async({model, filter={}, data=[]}= {})=>{
  const result = await model.updateMany(filter, data)
  return result
}

export const findByIdAndUpdate = async({model, filter={}, data={}, options={}, select = "", populate = []}={})=>{
  const result = await model.findByIdAndUpdate(filter, data, options).select(select).populate(populate)
  return result
}

export const findOneAndUpdate = async({model, filter={}, data={}, options={}, select = "", populate = []}={})=>{
  const result = await model.findOneAndUpdate(filter, data, options).select(select).populate(populate)
  return result
}

// Deleting
export const DeleteOne = async({model, filter={}}={})=>{
  const result = await model.DeleteOne(filter)
  return result
}

export const DeleteMany = async({model, filter={}}={})=>{
  const result = await model.DeleteMany(filter)
  return result
}

export const findByIdAndDelete = async({model, filter={}, select = "", populate = []}={})=>{
  const result = await model.findByIdAndDelete(filter).select(select).populate(populate)
  return result
}

export const findOneAndDelete = async({model, filter={}, select = "", populate = []}={})=>{
  const result = await model.findOneAndDelete(filter).select(select).populate(populate)
  return result
}

// Removing
export const findByIdAndRemove = async({model, filter={}, select = "", populate = []}={})=>{
  const result = await model.findByIdAndRemove(filter).select(select).populate(populate)
  return result
}

export const findOneAndRemove = async({model, filter={}, select = "", populate = []}={})=>{
  const result = await model.findOneAndRemove(filter).select(select).populate(populate)
  return result
}
