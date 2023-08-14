import { AddAccountRepository } from "@/data/repositories";
import { AccountModel } from "@/domain/models";
import { mongoHelper } from "../helpers";


export class MongoDbAccountRepository implements AddAccountRepository {
	async add(params: AddAccountRepository.Params): Promise<AccountModel> {

		const accountCollection = mongoHelper.getCollection('accounts')
		const result = await accountCollection.insertOne(params)
		const account = await accountCollection.findOne<AccountModel>(result.insertedId)
		return account
	}
}