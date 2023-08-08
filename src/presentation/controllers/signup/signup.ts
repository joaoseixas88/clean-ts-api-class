import { InvalidFieldError, MissingParamError } from "@/presentation/errors"
import { badRequest } from "@/presentation/helpers"
import { Controller, HttpRequest, HttpResponse } from "@/presentation/protocols"

export class SignUpController implements Controller {
	handle(httpRequest: HttpRequest): HttpResponse {
		const requiredField = ['name', 'email', 'password', 'passwordConfirmation']
		for (const field of requiredField) {
			if (!httpRequest.body[field]) return badRequest(new MissingParamError(field))
		}
		if (httpRequest.body.password !== httpRequest.body.passwordConfirmation) {
			return badRequest(new InvalidFieldError('passwordConfirmation'))
		}
	}
}
