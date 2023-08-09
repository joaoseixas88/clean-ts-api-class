import { SignUpController } from "@/presentation/controllers/signup/signup"
import { InvalidParamError, MissingParamError, ServerError } from "@/presentation/errors"
import { EmailValidator } from "@/presentation/protocols"

type SutTypes = {
	sut: SignUpController,
	emailValidatorStub: EmailValidator
}


const makeEmailValidator = () => {
	class EmailValidatorStub implements EmailValidator {
		isValid(email: string): boolean {
			return true
		}
	}
	return new EmailValidatorStub()
}

const makeEmailValidatorWihError = () => {
	class EmailValidatorStub implements EmailValidator {
		isValid(email: string): boolean {
			throw new Error('Something wrong')
		}
	}
	return new EmailValidatorStub()
}

const makeSut = (): SutTypes => {
	const emailValidatorStub = makeEmailValidator()
	const sut = new SignUpController(emailValidatorStub)
	return {
		sut,
		emailValidatorStub
	}
}

describe('SignUp Controller', () => {
	test('Should return 400 if no name is provided', () => {
		const { sut } = makeSut()
		const httpRequest = {
			body: {
				email: 'any_email@mail.com',
				password: 'any_password',
				passwordConfirmation: 'any_password'
			}
		}
		const httpResponse = sut.handle(httpRequest)
		expect(httpResponse.statusCode).toBe(400)
		expect(httpResponse.body).toEqual(new MissingParamError('name'))
	})
	test('Should return 400 if no email is provided', () => {
		const { sut } = makeSut()
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
		const { sut } = makeSut()
		const httpRequest = {
			body: {
				name: 'any_name',
				email: 'any_email@mail.com',
				passwordConfirmation: 'any_password'
			}
		}
		const httpResponse = sut.handle(httpRequest)
		expect(httpResponse.statusCode).toBe(400)
		expect(httpResponse.body).toEqual(new MissingParamError('password'))
	})
	test('Should return 400 if no passwordConfirmation is provided', () => {
		const { sut } = makeSut()
		const httpRequest = {
			body: {
				name: 'any_name',
				email: 'any_email@mail.com',
				password: 'any_password',
			}
		}
		const httpResponse = sut.handle(httpRequest)
		expect(httpResponse.statusCode).toBe(400)
		expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirmation'))
	})
	test('Should return 400 if no passwordConfirmation is not equal to password', () => {
		const { sut } = makeSut()
		const httpRequest = {
			body: {
				name: 'any_name',
				email: 'any_email@mail.com',
				password: 'any_password',
				passwordConfirmation: 'different_password'
			}
		}
		const httpResponse = sut.handle(httpRequest)
		expect(httpResponse.statusCode).toBe(400)
		expect(httpResponse.body).toEqual(new InvalidParamError('passwordConfirmation'))
	})

	test('Should return 400 if an invalid email is provided', () => {
		const { sut, emailValidatorStub } = makeSut()
		jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
		const httpRequest = {
			body: {
				name: 'any_name',
				email: 'invalid@mail.com',
				password: 'any_password',
				passwordConfirmation: 'any_password'
			}
		}
		const httpResponse = sut.handle(httpRequest)
		expect(httpResponse.statusCode).toBe(400)
		expect(httpResponse.body).toEqual(new InvalidParamError('email'))
	})
	test('Should call email validator with correct email', () => {
		const { sut, emailValidatorStub } = makeSut()
		const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
		const httpRequest = {
			body: {
				name: 'any_name',
				email: 'any_email@mail.com',
				password: 'any_password',
				passwordConfirmation: 'any_password'
			}
		}
		sut.handle(httpRequest)
		expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com')
	})
	test('Should return 500 if EmailValidator throws', () => {

		const emailValidatorStub = makeEmailValidatorWihError()
		const sut = new SignUpController(emailValidatorStub)
		const httpRequest = {
			body: {
				name: 'any_name',
				email: 'any_email@mail.com',
				password: 'any_password',
				passwordConfirmation: 'any_password'
			}
		}
		const httpResponse = sut.handle(httpRequest)
		expect(httpResponse.statusCode).toBe(500)
		expect(httpResponse.body).toEqual(new ServerError())
	})


})