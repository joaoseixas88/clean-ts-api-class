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

		const accountResult = await this.addAccountRepository.add({
			...account,
			password: hashedPassword
		})

		return accountResult
	}
}