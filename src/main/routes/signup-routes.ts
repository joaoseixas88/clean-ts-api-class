import { Router } from "express";
import { adaptExpressRoute } from "../adapters";
import { makeSignupValidation } from "../factories/validations/signup-validation";
import { makeSignUpController } from "../factories/controllers";


export default (router: Router): void => {

	router.post('/signup', adaptExpressRoute(makeSignUpController()))
}