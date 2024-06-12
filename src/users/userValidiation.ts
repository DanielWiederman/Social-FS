import { ValidationChain, check, validationResult } from "express-validator";
import { mustStringValidator, passwordValidator } from "../utils/validationUtils";
import { NextFunction, Response } from "express";


export const userCreateValidationRules: ValidationChain[] = [
    mustStringValidator("first_name"),
    mustStringValidator("last_name"),
    check("email").isEmail(),
    passwordValidator(),
]

export const userDetailsUpdateValidationRules: ValidationChain[] = [
    mustStringValidator("first_name"),
    mustStringValidator("last_name"),
]

