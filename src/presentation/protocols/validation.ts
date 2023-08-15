export interface Validation {
	validate(params: any): Error | void
}