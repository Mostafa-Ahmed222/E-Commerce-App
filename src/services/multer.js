import multer from "multer";
export const HME = (err, req, res, next) => {
  if (err) {
    next(new Error(err, {cause: 400}))
  } else {
    next();
  }
};
export const validationTypes = {
  image: ["image/jpeg", "image/png", "image/jif"],
  pdf: ["application/pdf"],
};
export const myMulter = (customValidation) => {
  const storage = multer.diskStorage({});
  const fileFilter = (req, file, cb) => {
    if (customValidation.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb("in-valid Format", false);
    }
  };
  const upload = multer({ fileFilter, storage });
  return upload;
};