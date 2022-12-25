const dataMethods = ["body", "query", "params", "files", "file", "headers"];
const validation = (Schema) => {
  return (req, res, next) => {
    try {
      const validationArr = [];
      dataMethods.forEach((key) => {
        if (Schema[key]) {
          const validationResult = Schema[key].validate(req[key], {
            abortEarly: false,
          });
          if (validationResult?.error?.details) {
            validationArr.push(validationResult.error.details);
          }
        }
      });
      if (validationArr.length) {
        return res.json({ message: "Validation error", validationArr });
      } else {
        return next();
      }
    } catch (error) {
      return res
        .status(500)
        .json({
          message: "catch error",
          message: error.message,
        });
    }
  };
};
export default validation;
