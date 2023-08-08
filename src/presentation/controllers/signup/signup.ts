import { InvalidParamError, MissingParamError } from "@/presentation/errors"
import { badRequest } from "@/presentation/helpers"
import { Controller, EmailValidator, HttpRequest, HttpResponse } from "@/presentation/protocols"


export class SignUpController implements Controller {
	constructor(
		private readonly emailValidator: EmailValidator,
	) { }
	handle(httpRequest: HttpRequest): HttpResponse {
		try {
			const requiredField = ['name', 'email', 'password', 'passwordConfirmation']
			for (const field of requiredField) {
				if (!httpRequest.body[field]) return badRequest(new MissingParamError(field))
			}
			if (httpRequest.body.password !== httpRequest.body.passwordConfirmation) {
				return badRequest(new InvalidParamError('passwordConfirmation'))
			}
			const isValid = this.emailValidator.isValid(httpRequest.body.email)
			if (!isValid) {
				return badRequest(new InvalidParamError('email'))
			}
		} catch (error: any) {
			return {
				statusCode: 500,
				body: error
			}
		}
	}
}
