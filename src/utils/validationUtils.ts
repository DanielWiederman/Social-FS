import { NextFunction, Request, RequestHandler, Response } from "express"
import { ValidationChain, check, validationResult } from "express-validator"

//matches(/^\p{L}+$/u): Ensures the value contains only alphabetic characters from any language.
//The \p{L} matches any kind of letter from any language 
//The u flag enables Unicode matching.

export const mustStringValidator = (fieldName: string): ValidationChain => {
  return check(fieldName)
    .notEmpty()
    .withMessage(`${fieldName} is required`)
    .bail() // If not empty, proceed to the next check
    .isString()
    .withMessage(`${fieldName} must be a string`)
    .bail() // If is a string, proceed to the next check
    .matches(/^\p{L}+$/u)
    .withMessage(`${fieldName} must contain only alphabetic characters`);
};

export const passwordValidator = () => {
    return check('password').isStrongPassword({
        minLength: 6,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
    }).withMessage("password is empty or weak")}


  export const wrapValidationMiddleware = (validations: ValidationChain[]): RequestHandler[] => {
        return [
          ...validations,
          (req: Request, res: Response, next: NextFunction): void => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
              res.status(400).json({ errors: errors.array() });
              return;
            }
            next();
          },
        ];
      };
      