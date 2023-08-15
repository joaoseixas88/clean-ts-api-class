import { AccountModel, AddAccount, EmailValidator, SignUpController, Validation, badRequest, serverError } from '@/presentation/controllers/signup'
import { InvalidParamError, MissingParamError, ServerError } from "@/presentation/errors"

type SutTypes = {
	sut: SignUpController,
	emailValidatorStub: EmailValidator
	addAccountStub: AddAccount
	validationStub: Validation
}
const makeFakeError = () => {
	const fakeError = new Error()
	fakeError.stack = 'fakeError'
	return fakeError
}

const makeAccount = () => ({
	name: 'any_name',
	email: 'any_email@mail.com',
	password: 'any_password',
	passwordConfirmation: 'any_password'
})

const makeFakeRequest = () => ({
	body: makeAccount()
})

const makeEmailValidator = () => {
	class EmailValidatorStub implements EmailValidator {
		isValid(email: string): boolean {
			return true
		}
	}
	return new EmailValidatorStub()
}

const makeFakeAccount = () => ({
	id: 'valid_id',
	name: 'valid_name',
	email: 'valid_email@mail.com',
	password: 'valid_password',
})
const makeAddAccount = () => {
	class AddAccountStub implements AddAccount {
		async add(account: AddAccount.Params): Promise<AccountModel> {
			return makeFakeAccount()
		}
	}
	return new AddAccountStub()
}
const makeValidation = () => {
	class ValidationStub implements Validation {
		validate(params: any): void | Error {
			return
		}
	}
	return new ValidationStub()
}

const makeSut = (): SutTypes => {
	const emailValidatorStub = makeEmailValidator()
	const addAccountStub = makeAddAccount()
	const validationStub = makeValidation()
	const sut = new SignUpController(validationStub, emailValidatorStub, addAccountStub)
	return {
		sut,
		emailValidatorStub,
		addAccountStub,
		validationStub
	}
}

describe('SignUp Controller', () => {
	test('Should return 400 if no name is provided', async () => {
		const { sut, validationStub } = makeSut()
		jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('name'))
		const httpRequest = {
			body: {
				email: 'any_email@mail.com',
				password: 'any_password',
				passwordConfirmation: 'any_password'
			}
		}
		const httpResponse = await sut.handle(httpRequest)
		console.log("httpResponse:", httpResponse);
		expect(httpResponse).toEqual(badRequest(new MissingParamError('name')))
	})
	test('Should return 400 if no email is provided', async () => {
		const { sut, validationStub } = makeSut()
		jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('email'))
		const httpRequest = {
			body: {
				name: 'any_name',
				password: 'any_password',
				passwordConfirmation: 'any_password'
			}
		}
		const httpResponse = await sut.handle(httpRequest)
		expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
	})
	test('Should return 400 if no password is provided', async () => {
		const { sut, validationStub } = makeSut()
		jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('password'))
		const httpRequest = {
			body: {
				name: 'any_name',
				email: 'any_email@mail.com',
				passwordConfirmation: 'any_password'
			}
		}
		const httpResponse = await sut.handle(httpRequest)
		expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
	})
	test('Should return 400 if no passwordConfirmation is provided', async () => {
		const { sut, validationStub } = makeSut()
		jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('passwordConfirmation'))
		const httpRequest = {
			body: {
				name: 'any_name',
				email: 'any_email@mail.com',
				password: 'any_password',
			}
		}
		const httpResponse = await sut.handle(httpRequest)
		expect(httpResponse).toEqual(badRequest(new MissingParamError('passwordConfirmation')))
	})
	test('Should return 400 if no passwordConfirmation is not equal to password', async () => {
		const { sut, validationStub } = makeSut()
		jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new InvalidParamError('passwordConfirmation'))
		const httpRequest = {
			body: {
				name: 'any_name',
				email: 'any_email@mail.com',
				password: 'any_password',
				passwordConfirmation: 'different_password'
			}
		}
		const httpResponse = await sut.handle(httpRequest)
		expect(httpResponse).toEqual(badRequest(new InvalidParamError('passwordConfirmation')))
	})
	test('Should return 400 if an invalid email is provided', async () => {
		const { sut, emailValidatorStub } = makeSut()
		jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
		const httpRequest = makeFakeRequest()
		const httpResponse = await sut.handle(httpRequest)
		expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
	})
	test('Should call email validator with correct email', async () => {
		const { sut, emailValidatorStub } = makeSut()
		const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
		const httpRequest = makeFakeRequest()
		sut.handle(httpRequest)
		expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com')
	})
	test('Should return 500 if EmailValidator throws', async () => {

		const { sut, emailValidatorStub } = makeSut()
		jest.spyOn(emailValidatorStub, 'isValid').mockImplementation(() => {
			const fakeError = makeFakeError()
			throw fakeError
		})
		const httpRequest = makeFakeRequest()
		const httpResponse = await sut.handle(httpRequest)
		expect(httpResponse).toEqual(serverError(makeFakeError()))
	})
	test('Should call AddAccount with correct params', async () => {
		const { sut, addAccountStub } = makeSut()
		const addSpy = jest.spyOn(addAccountStub, 'add')
		const httpRequest = makeFakeRequest()
		sut.handle(httpRequest)
		expect(addSpy).toHaveBeenCalledWith({
			name: 'any_name',
			email: 'any_email@mail.com',
			password: 'any_password',
		})
	})
	test('Should return 500 if AddAccount throws', async () => {

		const { sut, addAccountStub } = makeSut()

		jest.spyOn(addAccountStub, 'add').mockImplementation(async () => {
			return new Promise((res, rej) => rej(makeFakeError()))
		})
		const httpRequest = makeFakeRequest()
		const httpResponse = await sut.handle(httpRequest)
		expect(httpResponse).toEqual(serverError(makeFakeError()))

	})

	test('Should return 200 if valid data is provided', async () => {
		const { sut } = makeSut()
		const httpRequest = makeFakeRequest()
		const httpResponse = await sut.handle(httpRequest)
		expect(httpResponse.statusCode).toBe(200)
		expect(httpResponse.body).toEqual(makeFakeAccount())
	})
})