import { InvalidParamError, MissingParamError } from "@/presentation/errors"
import { AddAccount, Controller, EmailValidator, HttpRequest, HttpResponse, badRequest, serverError, success } from "./signup-protocols"

export class SignUpController implements Controller {
	constructor(
		private readonly emailValidator: EmailValidator,
		private readonly addAccount: AddAccount,

	) { }
	async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
		try {
			const requiredField = ['name', 'email', 'password', 'passwordConfirmation']
			for (const field of requiredField) {
				if (!httpRequest.body[field]) return badRequest(new MissingParamError(field))
			}
			const { password, passwordConfirmation, email, name } = httpRequest.body
			if (password !== passwordConfirmation) {
				return badRequest(new InvalidParamError('passwordConfirmation'))
			}
			const isValid = this.emailValidator.isValid(email)
			if (!isValid) {
				return badRequest(new InvalidParamError('email'))
			}

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
