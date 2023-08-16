import { ControllerValidator } from "@/main/decorators/controller-validator"
import { Controller, Validation } from "@/presentation/protocols"

type DecoratorParams = {
	controller: Controller,
	validation: Validation
}
export const makeValidatorControllerDecorator = ({ controller, validation }: DecoratorParams) => {
	return new ControllerValidator(validation, controller)
}