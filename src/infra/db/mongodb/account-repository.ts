import { AddAccountRepository } from "@/data/repositories";
import { AccountModel } from "@/domain/models";
import { mongoHelper } from "../helpers";
import { WithId } from "mongodb";


export class MongoDbAccountRepository implements AddAccountRepository {
	async add(params: AddAccountRepository.Params): Promise<AccountModel> {

		const accountCollection = await mongoHelper.getCollection('accounts')
		const result = await accountCollection.insertOne(params)
		const accountData = await accountCollection.findOne<WithId<AccountModel>>(result.insertedId)
		const account = mongoHelper.idMapper(accountData)
		return account
	}
}