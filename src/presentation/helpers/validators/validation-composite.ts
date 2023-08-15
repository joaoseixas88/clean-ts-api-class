import { Validation } from "@/presentation/protocols";

export class ValidationComposite implements Validation {
	constructor(
		private readonly validations: Validation[],
	) { }
	validate(params: any): void | Error {
		for (const validation of this.validations) {
			const error = validation.validate(params)
			if (error) {
				return error
			}
		}
	}
}