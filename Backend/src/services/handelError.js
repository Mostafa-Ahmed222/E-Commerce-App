const asyncHandler= (fn)=>{
  return (req, res, next)=>{
    fn(req, res, next).catch((error)=>{
      if (process.env.MOOD === 'DEV') {
        next(new Error(error.stack, {cause: 500}))
      } else {
        next(new Error(error.message, {cause: 500}))
      }
    })
  }
}
export default asyncHandler

export const globalError = (err, req, res, next)=>{
  if (err) {
    if (process.env.MOOD === 'DEV') {
      typeof(err) === 'string' ? res.status(400).json({message: err}) :
        res.status(err['cause'] || 500).json({message: err.message})
    } else {
      typeof(err) === 'string' ? res.status(400).json({message: err}) :
        res.status(err['cause'] || 500).json({message: err.message})
    }
  }
}
