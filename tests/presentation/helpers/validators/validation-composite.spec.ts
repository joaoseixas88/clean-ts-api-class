import { CompareFieldsValidation, RequiredFieldsValidation, ValidationComposite } from "@/presentation/helpers/validators"
import { Validation } from "@/presentation/protocols"




const makeParams = () => ({
	name: 'any_name',
	email: 'any_mail@mail.com'
})
const makeSut = () => {
	class ValidationStub implements Validation {
		validate(params: any): void | Error {
			return undefined
		}
	}
	const validationStub = new ValidationStub()
	const secondValidationStub = new ValidationStub()
	const sut = new ValidationComposite([validationStub, secondValidationStub])
	return { sut, validationStub, secondValidationStub }
}

describe('ValidationComposite', () => {
	it('Should call validate method of an validation', () => {
		const { sut, validationStub, secondValidationStub } = makeSut()
		const validateSpy = jest.spyOn(validationStub, 'validate')
		const secondValidateSpy = jest.spyOn(secondValidationStub, 'validate')
		sut.validate(makeParams())
		expect(validateSpy).toHaveBeenCalled()
		expect(secondValidateSpy).toHaveBeenCalled()
	})
	it('Should call validate method with correct values', () => {
		const { sut, validationStub, secondValidationStub } = makeSut()
		const validateSpy = jest.spyOn(validationStub, 'validate')

		sut.validate(makeParams())
		expect(validateSpy).toHaveBeenCalledWith(makeParams())
	})
	it('Should returns an error if validate method returns an error', () => {
		const { sut, validationStub } = makeSut()
		jest.spyOn(validationStub, 'validate').mockReturnValue(new Error('any_error'))

		const error = sut.validate(makeParams())
		expect(error).toEqual(new Error('any_error'))
	})

	it('Should return undefined if no one validation returns error', () => {
		const { sut } = makeSut()

		const error = sut.validate(makeParams())
		expect(error).toBe(undefined)
	})

})