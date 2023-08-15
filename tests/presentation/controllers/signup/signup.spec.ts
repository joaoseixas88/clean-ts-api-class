import { AccountModel, AddAccount, EmailValidator, SignUpController, badRequest } from '@/presentation/controllers/signup'
import { InvalidParamError, MissingParamError, ServerError } from "@/presentation/errors"

type SutTypes = {
	sut: SignUpController,
	emailValidatorStub: EmailValidator
	addAccountStub: AddAccount
}



const makeEmailValidator = () => {
	class EmailValidatorStub implements EmailValidator {
		isValid(email: string): boolean {
			return true
		}
	}
	return new EmailValidatorStub()
}


const makeAddAccount = () => {
	class AddAccountStub implements AddAccount {
		async add(account: AddAccount.Params): Promise<AccountModel> {
			const fakeAccount = {
				id: 'valid_id',
				name: 'valid_name',
				email: 'valid_email@mail.com',
				password: 'valid_password'
			}
			return fakeAccount
		}
	}
	return new AddAccountStub()
}

const makeSut = (): SutTypes => {
	const emailValidatorStub = makeEmailValidator()
	const addAccountStub = makeAddAccount()
	const sut = new SignUpController(emailValidatorStub, addAccountStub)
	return {
		sut,
		emailValidatorStub,
		addAccountStub
	}
}

describe('SignUp Controller', () => {
	test('Should return 400 if no name is provided', async () => {
		const { sut } = makeSut()
		const httpRequest = {
			body: {
				email: 'any_email@mail.com',
				password: 'any_password',
				passwordConfirmation: 'any_password'
			}
		}
		const httpResponse = await sut.handle(httpRequest)
		expect(httpResponse).toEqual(badRequest(new MissingParamError('name')))
	})
	test('Should return 400 if no email is provided', async () => {
		const { sut } = makeSut()
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
		const { sut } = makeSut()
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
		const { sut } = makeSut()
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
		const { sut } = makeSut()
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
		const httpRequest = {
			body: {
				name: 'any_name',
				email: 'invalid@mail.com',
				password: 'any_password',
				passwordConfirmation: 'any_password'
			}
		}
		const httpResponse = await sut.handle(httpRequest)
		expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
	})
	test('Should call email validator with correct email', async () => {
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
	test('Should return 500 if EmailValidator throws', async () => {

		const { sut, emailValidatorStub } = makeSut()
		jest.spyOn(emailValidatorStub, 'isValid').mockImplementation(() => {
			throw new Error()
		})
		const httpRequest = {
			body: {
				name: 'any_name',
				email: 'any_email@mail.com',
				password: 'any_password',
				passwordConfirmation: 'any_password'
			}
		}
		const httpResponse = await sut.handle(httpRequest)
		expect(httpResponse.statusCode).toBe(500)
		expect(httpResponse.body).toEqual(new ServerError())
	})
	test('Should call AddAccount with correct params', async () => {
		const { sut, addAccountStub } = makeSut()
		const addSpy = jest.spyOn(addAccountStub, 'add')
		const httpRequest = {
			body: {
				name: 'any_name',
				email: 'any_email@mail.com',
				password: 'any_password',
				passwordConfirmation: 'any_password'
			}
		}
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
			return new Promise((res, rej) => rej(new Error()))
		})
		const httpRequest = {
			body: {
				name: 'any_name',
				email: 'any_email@mail.com',
				password: 'any_password',
				passwordConfirmation: 'any_password'
			}
		}
		const httpResponse = await sut.handle(httpRequest)
		expect(httpResponse.statusCode).toBe(500)
		expect(httpResponse.body).toEqual(new ServerError())
	})

	test('Should return 200 if valid data is provided', async () => {
		const { sut } = makeSut()
		const httpRequest = {
			body: {
				name: 'valid_name',
				email: 'valid_email@mail.com',
				password: 'valid_password',
				passwordConfirmation: 'valid_password'
			}
		}
		const httpResponse = await sut.handle(httpRequest)
		expect(httpResponse.statusCode).toBe(200)
		expect(httpResponse.body).toEqual({
			id: 'valid_id',
			name: 'valid_name',
			email: 'valid_email@mail.com',
			password: 'valid_password',
		})
	})
})