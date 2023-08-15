import request from 'supertest'
import app from '@/main/config/app'
import dotenv from 'dotenv'
import { mongoHelper } from '@/infra/db'
import { Collection } from 'mongodb'

let collection: Collection
beforeAll(async () => {
	await mongoHelper.connect()
	collection = await mongoHelper.getCollection('accounts')
})

afterAll(async () => {
	await mongoHelper.disconnect()
})

beforeEach(async () => {
	await collection.deleteMany({})
})

describe('Body Parser Middleware', () => {
	test('Should parse body as json', async () => {
		await request(app).post('/api/signup')
			.send({
				name: 'João Emilio Seixas',
				email: 'joaoseixas.dev@gmail.com',
				password: '123',
				passwordConfirmation: '123'
			})
			.expect(200)
	})

})