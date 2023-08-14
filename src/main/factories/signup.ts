import { SignUpController } from "@/presentation/controllers"
import { makeAddAccountUsecase } from "./usecases"
import { makeEmailValidator } from "./utils"

export const makeSignUpController = () => {
	return new SignUpController(makeEmailValidator(), makeAddAccountUsecase())
}