import { Controller, HttpResponse } from "@/presentation/protocols";
import { MongoDbLogRepository } from '@/infra/db/mongodb'

const logRepository = new MongoDbLogRepository()

export const log = () => function (target: Controller, propertyKey: string, descriptor: PropertyDescriptor) {
	const originalMethod: Controller['handle'] = descriptor.value
	descriptor.value = async function (...args: any[]) {
		const httpResponse: HttpResponse = await originalMethod.apply(this, args)
		console.log("httpResponse:", httpResponse);
		if (httpResponse.statusCode === 500) {
			await logRepository.logError(httpResponse.body)
		}
		return httpResponse
	}
	return descriptor
}