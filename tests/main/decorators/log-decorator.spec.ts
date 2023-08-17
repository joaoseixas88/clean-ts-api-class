import { mongoHelper } from "@/infra/db"
import { log } from "@/main/decorators/controller-decorator"
import { ServerError } from "@/presentation/errors"
import { serverError } from "@/presentation/helpers"
import { Controller, HttpRequest, HttpResponse } from "@/presentation/protocols"
import { Collection } from "mongodb"

let collection: Collection | null

const makeHttpResponse = (): HttpResponse => ({
	statusCode: 200,
	body: {
		name: 'any_name',
		email: 'any_mail@mail.com'
	}
})
const makeHttpRequest = (): HttpRequest => ({
	body: {
		name: 'any_name',
		email: 'any_mail@mail.com'
	}
})

const makeSut = () => {
	class ControllerSpy implements Controller {
		error: Error | null = null
		@log()
		async handle(params: HttpRequest): Promise<HttpResponse> {
			if (this.error) {
				return serverError(this.error)
			}
			return makeHttpResponse()
		}
	}

	const sut = new ControllerSpy()
	return { sut }
}

describe('Controller LogDecorator', () => {
	beforeAll(async () => {
		await mongoHelper.connect()
		collection = await mongoHelper.getCollection('errors')
	})

	afterAll(async () => {
		await mongoHelper.disconnect()
	})

	beforeEach(async () => {
		await collection.deleteMany({})
	})
	it('Should not save log when no error has been catched', async () => {
		const { sut } = makeSut()

		await sut.handle(makeHttpRequest())
		const collectionData = await collection.countDocuments()
		expect(collectionData).toBe(0)
	})
	it('Should create a log in db when sut returns 500', async () => {
		const { sut } = makeSut()
		const fakeError = new Error('Erro_')
		fakeError.stack = 'any_stack_error'
		sut.error = fakeError
		const result = await sut.handle(makeHttpRequest())
		const collectionData = await collection.countDocuments()
		expect(collectionData).toBe(1)
	})
})