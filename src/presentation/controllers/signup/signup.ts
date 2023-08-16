import { InvalidParamError, MissingParamError } from "@/presentation/errors"
import { AddAccount, Controller, EmailValidator, HttpRequest, HttpResponse, Validation, badRequest, serverError, success } from "./signup-protocols"
import { EmailValidatorAdapter } from "@/presentation/utils"

type IRequest = {
	name: string
	email: string
	password: string
	passwordConfirmation: string
}

export class SignUpController implements Controller {
	constructor(
		private readonly validation: Validation,
		private readonly addAccount: AddAccount,

	) { }
	async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
		try {
			const error = this.validation.validate(httpRequest.body)
			if (error) return badRequest(error)
			const { body: { email, name, password } } = httpRequest
			const account = await this.addAccount.add({
				email,
				name,
				password
			})

			return success(account)
		} catch (error: any) {
			return serverError(error)
		}
	}
}
