import { MissingParamError } from "@/presentation/errors";
import { Controller, HttpRequest, HttpResponse, Validation, badRequest, success } from "../signup";

export class LoginController implements Controller {
	constructor(
	) { }
	handle(params: HttpRequest): Promise<HttpResponse> {

		return new Promise(res => res(badRequest(new MissingParamError('email'))))
	}
}