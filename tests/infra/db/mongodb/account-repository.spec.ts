import { MongoDbAccountRepository, mongoHelper } from "@/infra/db"
import { Collection } from "mongodb"

let collection: Collection

describe('MongoAccountRepository', () => {
	beforeAll(async () => {
		await mongoHelper.connect()
		collection = await mongoHelper.getCollection('accounts')
	})

	afterAll(async () => {
		await mongoHelper.disconnect()
	})

	afterEach(async () => {
		await collection.deleteMany({})
	})
	test('Should return an account on success', async () => {
		const sut = new MongoDbAccountRepository()
		const accountData = {
			name: 'any_name',
			email: 'any_email@mail.com',
			password: "any_password"
		}
		const account = await sut.add(accountData)
		expect(account).toBeTruthy()
		expect(account.id).toBeTruthy()
		expect(account.name).toBe('any_name')
		expect(account.email).toBe('any_email@mail.com')
		expect(account.password).toBe('any_password')
	})
})