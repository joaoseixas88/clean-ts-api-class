import { Authentication, Controller, HttpRequest, HttpResponse, Validation, badRequest, serverError, success, unauthorized } from "./login-protocols";

export class LoginController implements Controller {
	constructor(
		private readonly validation: Validation,
		private readonly authentication: Authentication,
	) { }
	async handle(params: HttpRequest): Promise<HttpResponse> {
		try {
			const error = this.validation.validate(params)
			if (error) return new Promise(res => res(badRequest(error)))
			const token = await this.authentication.auth(params.body)
			if (!token) return unauthorized()
			return new Promise(res => res(success()))
		} catch (error) {
			return serverError(error)
		}
	}
}