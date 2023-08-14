import { Router } from "express";
import { adaptExpressRoute } from "../adapters";
import { makeSignUpController } from "../factories/signup";


export default (router: Router): void => {

	router.post('/signup', adaptExpressRoute(makeSignUpController()))
}