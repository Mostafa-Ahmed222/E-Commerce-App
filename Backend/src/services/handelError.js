const asyncHandler= (fn)=>{
  return (req, res, next)=>{
    fn(req, res, next).catch((error)=>{
      next(new Error(error.message, {cause: 500}))
    })
  }
}
export default asyncHandler

export const globalError = (err, req, res, next)=>{
  if (err) {
    if (process.env.MOOD === 'DEV') {
      res.status(err['cause']).json({message: err.message, stack: err.stack})
    } else {
      res.status(err['cause']).json({message: err.message})
    }
  }
}
