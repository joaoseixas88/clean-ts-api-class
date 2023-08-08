import { SignUpController } from "@/presentation/controllers/signup/signup"
import { InvalidFieldError, MissingParamError } from "@/presentation/errors"

const makeSut = (): SignUpController => {
	return new SignUpController()
}

describe('SignUp Controller', () => {
	test('Should return 400 if no name is provided', () => {
		const sut = makeSut()
		const httpRequest = {
			body: {
				email: 'any_email',
				password: 'any_password',
				passwordConfirmation: 'any_password'
			}
		}
		const httpResponse = sut.handle(httpRequest)
		expect(httpResponse.statusCode).toBe(400)
		expect(httpResponse.body).toEqual(new MissingParamError('name'))
	})
	test('Should return 400 if no email is provided', () => {
		const sut = makeSut()
		const httpRequest = {
			body: {
				name: 'any_name',
				password: 'any_password',
				passwordConfirmation: 'any_password'
			}
		}
		const httpResponse = sut.handle(httpRequest)
		expect(httpResponse.statusCode).toBe(400)
		expect(httpResponse.body).toEqual(new MissingParamError('email'))
	})
	test('Should return 400 if no password is provided', () => {
		const sut = makeSut()
		const httpRequest = {
			body: {
				name: 'any_name',
				email: 'any_email',
				passwordConfirmation: 'any_password'
			}
		}
		const httpResponse = sut.handle(httpRequest)
		expect(httpResponse.statusCode).toBe(400)
		expect(httpResponse.body).toEqual(new MissingParamError('password'))
	})
	test('Should return 400 if no passwordConfirmation is provided', () => {
		const sut = makeSut()
		const httpRequest = {
			body: {
				name: 'any_name',
				email: 'any_email',
				password: 'any_password',
			}
		}
		const httpResponse = sut.handle(httpRequest)
		expect(httpResponse.statusCode).toBe(400)
		expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirmation'))
	})
	test('Should return 400 if no passwordConfirmation is not equal to password', () => {
		const sut = makeSut()
		const httpRequest = {
			body: {
				name: 'any_name',
				email: 'any_email',
				password: 'any_password',
				passwordConfirmation: 'different_password'
			}
		}
		const httpResponse = sut.handle(httpRequest)
		expect(httpResponse.statusCode).toBe(400)
		expect(httpResponse.body).toEqual(new InvalidFieldError('passwordConfirmation'))
	})


})