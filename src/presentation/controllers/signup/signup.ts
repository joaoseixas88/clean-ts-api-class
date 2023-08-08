import { MissingParamError } from "@/presentation/errors"
import { badRequest } from "@/presentation/helpers"
import { HttpResponse } from "@/presentation/protocols"

export class SignUpController {
	handle(httpRequest: any): HttpResponse {
		const requiredField = ['name', 'email', 'password', 'passwordConfirmation']
		for (const field of requiredField) {
			if (!httpRequest.body[field]) return badRequest(new MissingParamError(field))
		}
	}
}
