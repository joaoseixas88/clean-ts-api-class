import { InvalidParamError } from "@/presentation/errors";
import { Validation } from "@/presentation/protocols";

export class CompareFieldsValidation implements Validation {
	constructor(
		private readonly field: string,
		private readonly comparableField: string,
	) { }

	validate(params: any): void | Error {
		if (params[this.field] !== params[this.comparableField]) {
			return new InvalidParamError(this.comparableField)
		}
	}
}