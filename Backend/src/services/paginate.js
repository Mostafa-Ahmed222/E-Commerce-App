const paginate = (page, size) => {
  if (!page || page <= 0) {
    page = 1;
  }
  if (!size || size <= 0) {
    size = 3;
  }
  const skip = (page - 1) * size;
  return { skip, limit: size };
};
export default paginate;
