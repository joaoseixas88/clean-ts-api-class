import { Authentication } from '@/domain/usecases';
import { LoginController, serverError, unauthorized } from '@/presentation/controllers';
import { MissingParamError, InvalidParamError } from '@/presentation/errors';
import { Validation } from '@/presentation/protocols';

const makeHttpRequest = {

}

const makeSut = () => {
	const requiredFields = ['email', 'password']

	class ValidationCompositeStub implements Validation {
		validate(params: any): void | Error {
		}

	}

	const validationStub = new ValidationCompositeStub()
	class AuthenticationStub implements Authentication {
		async auth(params: { email: string, password: string }): Promise<string> {
			return new Promise(res => res('access_token'))
		}
	}
	const authenticationStub = new AuthenticationStub()

	const sut = new LoginController(validationStub, authenticationStub)
	return { sut, validationStub, authenticationStub }
}

describe('LoginController', () => {
	it('Should return 400 if no email is provided	', async () => {
		const { sut, validationStub } = makeSut()
		jest.spyOn(validationStub, 'validate').mockImplementation(params => {
			if (!params.body['email']) {
				return new MissingParamError('email')
			}
		})
		const { statusCode, body } = await sut.handle({
			body: {
				password: 'any_password',
			}
		})
		expect(statusCode).toBe(400)
		expect(body).toEqual(new MissingParamError('email'))
	})
	it('Should return 400 if no password is provided	', async () => {
		const { sut, validationStub } = makeSut()
		jest.spyOn(validationStub, 'validate').mockImplementation(params => {
			if (!params.body['password']) {
				return new MissingParamError('password')
			}
		})
		const { statusCode, body } = await sut.handle({
			body: {
				email: 'any_email@mail.com',
			}
		})
		expect(statusCode).toBe(400)
		expect(body).toEqual(new MissingParamError('password'))
	})
	it('Should return 500 if Authentication throws	', async () => {
		const { sut, authenticationStub } = makeSut()
		jest.spyOn(authenticationStub, 'auth').mockImplementation(() => {
			throw new Error()
		})
		const httpResponse = await sut.handle({
			body: {
				email: 'any_email@mail.com',
				password: 'any_password'
			}
		})
		expect(httpResponse).toEqual(serverError(new Error()))
	})
	it('Should return 401 if invalid credentials', async () => {
		const { sut, authenticationStub } = makeSut()
		jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(new Promise(res => res(null)))
		const httpResponse = await sut.handle({
			body: {
				email: 'any_email@mail.com',
				password: 'invalid_password'
			}
		})
		expect(httpResponse).toEqual(unauthorized())
	})
	it('Should return 400 if email provided is invalid', async () => {
		const { sut, validationStub } = makeSut()
		jest.spyOn(validationStub, 'validate').mockImplementation(params => {
			if (params.body['email'] === 'invalid_mail') {
				return new InvalidParamError('email')
			}
		})
		const { statusCode, body } = await sut.handle({
			body: {
				email: 'invalid_mail',
				password: 'any_password'
			}
		})
		expect(statusCode).toBe(400)
		expect(body).toEqual(new InvalidParamError('email'))
	})
	it('Should call Authentication with correct values', async () => {
		const { sut, authenticationStub } = makeSut()
		const authSpy = jest.spyOn(authenticationStub, 'auth')
		const { statusCode, body } = await sut.handle({
			body: {
				email: 'any_email@mail.com',
				password: 'any_password'
			}
		})
		expect(authSpy).toHaveBeenCalledWith({
			email: 'any_email@mail.com',
			password: 'any_password'
		})
	})

})