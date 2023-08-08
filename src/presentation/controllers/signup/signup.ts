import { MissingParamError } from "@/presentation/errors"
import { badRequest } from "@/presentation/helpers"
import { HttpResponse } from "@/presentation/protocols"

export class SignUpController {
	handle(httpRequest: any): HttpResponse {
		if (!httpRequest.body.name) return badRequest(new MissingParamError('name'))
		if (!httpRequest.body.email) return badRequest(new MissingParamError('email'))
	}
}