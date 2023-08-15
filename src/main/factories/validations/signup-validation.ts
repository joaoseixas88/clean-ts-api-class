import { CompareFieldsValidation, RequiredFieldsValidation, ValidationComposite } from "@/presentation/helpers";
import { Validation } from "@/presentation/protocols";

export const makeSignupValidation = (): Validation => {
	const validations = [] as Validation[]
	const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
	validations.push(new RequiredFieldsValidation(requiredFields))
	validations.push(new CompareFieldsValidation('password', 'passwordConfirmation'))
	return new ValidationComposite(validations)
}