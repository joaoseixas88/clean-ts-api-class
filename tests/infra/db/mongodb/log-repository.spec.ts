import { mongoHelper } from "@/infra/db"
import { MongoDbLogRepository } from "@/infra/db/mongodb"
import { Collection } from "mongodb"
let collection: Collection

const makeSut = () => {
	const sut = new MongoDbLogRepository()
	return sut
}
const makeFakeError = () => {
	const fakeError = new Error()
	fakeError.stack = 'any_stack_error'
	return fakeError
}

describe('MongoDbLogRepository', () => {
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
	it('Should return error stack on success', async () => {
		const sut = makeSut()
		await sut.logError(makeFakeError().stack)
		const insertResult = await collection.findOne({ stack: makeFakeError().stack })
		expect(insertResult._id).toBeTruthy()
		expect(insertResult.stack).toBe(makeFakeError().stack)
		expect(insertResult.date).toBeTruthy()
	})
})