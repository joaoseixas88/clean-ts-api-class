import { badRequest, success } from "@/presentation/helpers";
import { Controller, HttpRequest, HttpResponse, Validation } from "@/presentation/protocols";

export class ControllerValidator implements Controller {
	constructor(
		private readonly validation: Validation,
		private readonly controller: Controller,
	) { }
	async handle(params: HttpRequest): Promise<HttpResponse> {
		const error = this.validation.validate(params.body)
		if (error) return new Promise(res => res(badRequest(error)))
		const httpResponse = await this.controller.handle(params)
		return httpResponse
	}

}