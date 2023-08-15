import { LogRepository } from "@/data/repositories"
import { Controller, HttpRequest, HttpResponse } from "@/presentation/protocols"

export class LogControllerDecorator implements Controller {
	constructor(
		private readonly controller: Controller,
		private readonly logRepository: LogRepository,
	) { }
	async handle(params: HttpRequest): Promise<HttpResponse> {
		const httpResponse = await this.controller.handle(params)
		if (httpResponse.statusCode === 500) {
			await this.logRepository.save(httpResponse.body.stack)
		}
		return httpResponse
	}

}