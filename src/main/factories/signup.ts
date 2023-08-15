import { Controller, HttpRequest, HttpResponse, SignUpController } from "@/presentation/controllers"
import { makeAddAccountUsecase } from "./usecases"
import { makeEmailValidator } from "./utils"
import { LogControllerDecorator } from "../decorators/log"



export const makeSignUpController = () => {
	const signUpController = new SignUpController(makeEmailValidator(), makeAddAccountUsecase())
	return new LogControllerDecorator(signUpController)
}