import { EmailValidatorAdapter } from "@/presentation/utils"
import validator from "validator"

jest.mock('validator', () => ({
	isEmail(): boolean {
		return true
	}
}))

const sut = new EmailValidatorAdapter()

describe('EmailValidator Adapter', () => {
	test('Should return false if validator returns false', () => {
		jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)
		const isValid = sut.isValid('invalid_email@mail.com')
		expect(isValid).toBe(false)
	})
	test('Should return true if validator returns true', () => {
		const isValid = sut.isValid('valid_email@gmail.com')
		expect(isValid).toBe(true)
	})
	test('Should call validator with correct email', () => {
		const isEmailSpy = jest.spyOn(validator, 'isEmail')
		sut.isValid('valid_email@gmail.com')
		expect(isEmailSpy).toBeCalledWith('valid_email@gmail.com')
	})
})