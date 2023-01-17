const sorting = ({sortedField= "createdAt", orderedBy = 1}={})=>{
  if (orderedBy < -1) {
    orderedBy = -1
  } else if (orderedBy > 1) {
    orderedBy = 1
  }
  const sort = {}
  sort[sortedField] = orderedBy
  return sort
}
export default sorting