import { AccountModel } from "../models"

export interface AddAccount {
	add(account: AddAccount.Params): Promise<AccountModel>
}

export namespace AddAccount {
	export type Params = {
		name: string
		email: string
		password: string
	}
	export type Result = AccountModel
}