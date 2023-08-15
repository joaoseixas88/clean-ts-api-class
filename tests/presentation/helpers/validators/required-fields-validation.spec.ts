import { MissingParamError } from "@/presentation/errors"
import { RequiredFieldValidation } from "@/presentation/helpers"


const makeSut = () => {
	const requiredField = ['name', 'password', 'email']
	const sut = new RequiredFieldValidation(requiredField)
	return sut
}


describe('RequiredFields Validation', () => {
	it('Should return an MissingParamError if field is not in params', () => {
		const params = {
			email: 'any_email',
			password: 'any_password'
		}
		const sut = makeSut()
		const error = sut.validate(params)
		expect(error).toEqual(new MissingParamError('name'))
	})
	it('Should return falsy if field is in params ', () => {
		const sut = makeSut()
		const params = {
			name: 'any_name',
			email: 'any_email',
			password: 'any_password'
		}
		const error = sut.validate(params)
		expect(error).toBe(undefined)
	})
})