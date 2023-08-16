import { SignUpController } from "@/presentation/controllers"
import { makeLogControllerDecorator, makeValidatorControllerDecorator } from "../decorators"
import { makeAddAccountUsecase } from "../usecases"
import { makeSignupValidation } from "../validations"

export const makeSignUpController = () => {
	const validation = makeSignupValidation()
	const signUpController =
		new SignUpController(makeAddAccountUsecase())
	return makeValidatorControllerDecorator({ controller: makeLogControllerDecorator(signUpController), validation })
}