import joi from "joi";

//signup validation
export const signup = {
  body: joi
    .object()
    .required()
    .keys({
      userName: joi
        .string()
        .pattern(new RegExp(/[A-Z][a-zA-Z][^#&<>\"~;$^%{}?]{1,20}$/))
        .required(),
      email: joi.string().email().required().messages({
        "any.required": "please enter your email",
        "string.empty": "email can not be empty",
        "string.base": "please enter valid string email",
      }),
      phone: joi.string(),
      password: joi
        .string()
        .pattern(
          new RegExp(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/
          )
        )
        .required(),
      cPassword: joi
        .string()
        .valid(joi.ref("password"))
        .messages({
          "any.only": "cPassword not match with password",
        })
        .required(),
    }),
};
//confirmEmail validation

export const confirmEmail = {
  params: joi.object().required().keys({
    token: joi.string().required(),
  }),
};
//reConfirmEmail validation
export const reConfirmEmail = {
  params: joi.object().required().keys({
    token: joi.string().required(),
  }),
};
//signin validation
export const signin = {
  body: joi
    .object()
    .required()
    .keys({
      email: joi.string().email().required().messages({
        "any.required": "please enter your email",
        "string.empty": "email can not be empty",
        "string.base": "please enter valid string email",
      }),
      password: joi
        .string()
        .pattern(
          new RegExp(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/
          )
        )
        .messages({
          "string.pattern.base": "Password not match with true pattern",
        })
        .required(),
    }),
};
// accessCode
export const accessCode = {
  body: joi
    .object()
    .required()
    .keys({
      email: joi.string().email().required().messages({
        "any.required": "please enter your email",
        "string.empty": "email can not be empty",
        "string.base": "please enter valid string email",
      }),
    }),
};
export const forgetPassword = {
  body: joi
    .object()
    .required()
    .keys({
      email: joi.string().email().required().messages({
        "any.required": "please enter your email",
        "string.empty": "email can not be empty",
        "string.base": "please enter valid string email",
      }),
      code: joi.string().required(),
      newPassword: joi
        .string()
        .pattern(
          new RegExp(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/
          )
        )
        .required(),
      cPassword: joi
        .string()
        .valid(joi.ref("newPassword"))
        .messages({
          "any.only": "cPassword not match with password",
        })
        .required(),
    }),
}
