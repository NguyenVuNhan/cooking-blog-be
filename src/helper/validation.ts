import { validationResult } from "express-validator";

const appValidationResult = validationResult.withDefaults({
  formatter: (err) => ({
    [err.param]: err.msg,
  }),
});

export default appValidationResult;
