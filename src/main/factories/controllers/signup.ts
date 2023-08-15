import { SignUpController } from "@/presentation/controllers"
import { makeAddAccountUsecase } from "../usecases"
import { makeSignupValidation } from "../validations"
import { EmailValidatorAdapter } from "@/presentation/utils"
import { makeEmailValidator } from "../utils"
import { makeLogControllerDecorator } from "../decorators"

export const makeSignUpController = () => {
	const signUpController =
		new SignUpController(makeSignupValidation(), makeEmailValidator(), makeAddAccountUsecase())
	return makeLogControllerDecorator(signUpController)
}