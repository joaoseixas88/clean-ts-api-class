import { MissingParamError } from "@/presentation/errors"
import { LoginController } from "./login"

const makeHttpRequest = {

}

const makeSut = () => {

	const sut = new LoginController()
	return { sut }
}

describe('LoginController', () => {
	it('Should return 400 if no email is provided	', async () => {
		const { sut } = makeSut()
		const { statusCode, body } = await sut.handle({
			body: {
				password: 'any_password'
			}
		})

		expect(statusCode).toBe(400)
		expect(body).toEqual(new MissingParamError('email'))

	})
})