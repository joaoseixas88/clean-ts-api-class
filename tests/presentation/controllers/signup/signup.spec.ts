import { AccountModel, AddAccount, EmailValidator, SignUpController, Validation, badRequest, serverError } from '@/presentation/controllers/signup'
import { InvalidParamError, MissingParamError, ServerError } from "@/presentation/errors"

type SutTypes = {
	sut: SignUpController,
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
	const addAccountStub = makeAddAccount()
	const validationStub = makeValidation()
	const sut = new SignUpController(addAccountStub)
	return {
		sut,
		addAccountStub,
		validationStub
	}
}

describe('SignUp Controller', () => {
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