import { CompareFieldsValidation, EmailValidation, RequiredFieldsValidation, ValidationComposite } from "@/presentation/helpers";
import { Validation } from "@/presentation/protocols";
import { makeEmailValidator } from "../utils";

export const makeSignupValidation = (): Validation => {
	const validations = [] as Validation[]
	const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
	validations.push(new RequiredFieldsValidation(requiredFields))
	validations.push(new CompareFieldsValidation('password', 'passwordConfirmation'))
	validations.push(new EmailValidation('email', makeEmailValidator()))
	return new ValidationComposite(validations)
}