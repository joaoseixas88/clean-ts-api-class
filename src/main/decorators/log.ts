import { Controller, HttpRequest, HttpResponse } from "@/presentation/protocols"

export class LogControllerDecorator implements Controller {
	constructor(
		private readonly controller: Controller,

	) { }
	async handle(params: HttpRequest): Promise<HttpResponse> {
		const httpResponse = await this.controller.handle(params)
		return new Promise(res => res({ statusCode: 200 }))
	}

}