import { MissingParamError } from "@/presentation/errors";
import { Validation } from "@/presentation/protocols";

export class RequiredFieldsValidation implements Validation {
	constructor(
		private readonly fields: string[],
	) {
	}
	validate(params: any): void | Error {
		for (let field of this.fields) {
			if (!params[field]) {
				return new MissingParamError(field)
			}
		}
	}

}


