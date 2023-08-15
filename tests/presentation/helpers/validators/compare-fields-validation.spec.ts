import { InvalidParamError } from "@/presentation/errors"
import { CompareFieldsValidation } from "@/presentation/helpers/validators/"

const makeSut = () => {
	const sut = new CompareFieldsValidation('password', 'passwordConfirmation')
	return sut
}

describe('CompareFields Validation', () => {
	it('Should return InvalidParamError if fields are not equal', () => {
		const params = {
			password: 'any_password',
			passwordConfirmation: 'another_password'
		}
		const sut = makeSut()
		const error = sut.validate(params)
		expect(error).toEqual(new InvalidParamError('passwordConfirmation'))
	})
	it('Should return undefined if params are equal', () => {
		const params = {
			password: 'any_password',
			passwordConfirmation: 'any_password'
		}
		const sut = makeSut()
		const error = sut.validate(params)
		expect(error).toBe(undefined)
	})
})