import { InvalidParamError } from "@/presentation/errors"
import { EmailValidation } from "@/presentation/helpers/validators"
import { EmailValidator } from "@/presentation/protocols"

const makeParams = () => ({
	email: 'any_email@mail.com',
	name: 'any_name'
})

const makeSut = () => {
	const field = 'email'
	class EmailValidatorStub implements EmailValidator {
		isValid(email: string): boolean {
			return true
		}
	}
	const emailValidatorStub = new EmailValidatorStub()
	const sut = new EmailValidation(field, emailValidatorStub)
	return { sut, emailValidatorStub }
}

describe('EmailValidation', () => {
	it('It should return an error if email provided is invalid', () => {
		const { emailValidatorStub, sut } = makeSut()
		jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
		const error = sut.validate(makeParams())
		expect(error).toEqual(new InvalidParamError('email'))
	})
	it('It should return undefined if valid email is provided', () => {
		const { sut } = makeSut()
		const error = sut.validate(makeParams())
		expect(error).toBe(undefined)
	})
})