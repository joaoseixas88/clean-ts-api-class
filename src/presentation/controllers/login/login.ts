import { MissingParamError } from "@/presentation/errors";
import { Authentication, Controller, HttpRequest, HttpResponse, Validation, badRequest, success } from "../signup";

export class LoginController implements Controller {
	constructor(
		private readonly validation: Validation,
		private readonly authentication: Authentication,
	) { }
	async handle(params: HttpRequest): Promise<HttpResponse> {
		const error = this.validation.validate(params)
		if (error) return new Promise(res => res(badRequest(error)))
		const token = await this.authentication.auth(params.body)
		return new Promise(res => res(success()))
	}
}