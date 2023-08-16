export interface Authentication {
	auth(params: Authentication.Params): Promise<string>
}

export namespace Authentication {
	export type Params = {
		email: string
		password: string
	}
}