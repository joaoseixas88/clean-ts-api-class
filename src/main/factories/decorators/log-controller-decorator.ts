import { MongoDbLogRepository } from "@/infra/db"
import { LogControllerDecorator } from "@/main/decorators"
import { Controller } from "@/presentation/protocols"

export const makeLogControllerDecorator = (controller: Controller) => {
	const repository = new MongoDbLogRepository()
	return new LogControllerDecorator(controller, repository)
}