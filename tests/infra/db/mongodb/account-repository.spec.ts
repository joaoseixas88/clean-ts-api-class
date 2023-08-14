import { AccountModel } from "@/domain/models"
import { MongoDbAccountRepository, mongoHelper } from "@/infra/db"
import * as dotenv from 'dotenv'
import { Collection } from "mongodb"

let collection: Collection

beforeAll(async () => {
	dotenv.config()
	await mongoHelper.connect()
	collection = mongoHelper.getCollection('accounts')
})

afterAll(async () => {
	await mongoHelper.disconnect()
})
describe('MongoAccountRepository', () => {
	test('Should return an account on success', async () => {
		const sut = new MongoDbAccountRepository()
		const accountData = {
			name: 'any_name',
			email: 'any_email@mail.com',
			password: "any_password"
		}
		const account = await sut.add(accountData)
		await collection.deleteOne(account)
		expect(account).toBeTruthy()
		expect(account.name).toBe('any_name')
		expect(account.email).toBe('any_email@mail.com')
		expect(account.password).toBe('any_password')
	})
})