import { mongoHelper } from "@/infra/db"
import { MongoDbLogRepository } from "@/infra/db/mongodb"
import { Collection } from "mongodb"
let collection: Collection

const makeSut = () => {
	const sut = new MongoDbLogRepository()
	return sut
}

describe('MongoDbLogRepository', () => {
	beforeAll(async () => {
		await mongoHelper.connect()
		collection = await mongoHelper.getCollection('logs')
	})

	afterAll(async () => {
		await mongoHelper.disconnect()
	})

	afterEach(async () => {
		await collection.deleteMany({})
	})
	it('Should return error stack on success', async () => {
		const sut = makeSut()
		const fakeError = new Error()
		fakeError.stack = 'any_stack'
		const { date, stack, id } = await sut.log(fakeError.stack)
		expect(id).toBeTruthy()
		expect(stack).toBe('any_stack')
		expect(date).toBeTruthy()
	})
})