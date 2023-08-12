import { AccountModel } from "@/domain/models";
import { AddAccount } from "@/domain/usecases";
import { Encrypter } from "../protocols";
import { AddAccountRepository } from "../repositories";

export class DbAddAccount implements AddAccount {
	constructor(
		private readonly encrypter: Encrypter,
		private readonly addAccountRepository: AddAccountRepository,
	) { }
	async add(account: AddAccount.Params): Promise<AccountModel> {
		const hashedPassword = await this.encrypter.encrypt(account.password)
		await this.addAccountRepository.add(account)
		const accountResult = {
			email: 'any_email',
			name: 'any_name',
			password: 'any_password'
		}
		return {
			email: 'any_email',
			id: 'any_id',
			name: 'any_name',
			password: 'any_password'
		}
	}
}