import { AddAccount } from "@/domain/usecases"
import { InvalidParamError, MissingParamError } from "@/presentation/errors"
import { badRequest, serverError } from "@/presentation/helpers"
import { Controller, EmailValidator, HttpRequest, HttpResponse } from "@/presentation/protocols"


export class SignUpController implements Controller {
	constructor(
		private readonly emailValidator: EmailValidator,
		private readonly addAccount: AddAccount,

	) { }
	handle(httpRequest: HttpRequest): HttpResponse {
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

			const addResult = this.addAccount.add({
				email,
				name,
				password
			})
		} catch (error: any) {
			return serverError()
		}
	}
}
