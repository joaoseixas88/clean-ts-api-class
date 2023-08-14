import request from 'supertest'
import app from '@/main/config/app'

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