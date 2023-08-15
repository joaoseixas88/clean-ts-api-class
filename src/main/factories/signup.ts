import { Controller, HttpRequest, HttpResponse, SignUpController } from "@/presentation/controllers"
import { makeAddAccountUsecase } from "./usecases"
import { makeEmailValidator } from "./utils"
import { LogControllerDecorator } from "../decorators/log"
import { makeLogControllerDecorator } from "./decorators"



export const makeSignUpController = () => {
	const signUpController = new SignUpController(makeEmailValidator(), makeAddAccountUsecase())
	return makeLogControllerDecorator(signUpController)
}