import { MissingParamError } from "@/presentation/errors"
import { HttpResponse } from "@/presentation/protocols"

export class SignUpController {
	handle(httpRequest: any): HttpResponse {
		if (!httpRequest.body.name) {
			return {
				statusCode: 400,
				body: new MissingParamError('name')
			}
		}
		if (!httpRequest.body.email) {
			return {
				statusCode: 400,
				body: new MissingParamError('email')
			}
		}
	}
}