import { AddAccountRepository } from "@/data/repositories";
import { AccountModel } from "@/domain/models";
import { mongoHelper } from "../helpers";
import { idMapper } from "./id-mapper";
import { WithId } from "mongodb";


export class MongoDbAccountRepository implements AddAccountRepository {
	async add(params: AddAccountRepository.Params): Promise<AccountModel> {

		const accountCollection = mongoHelper.getCollection('accounts')
		const result = await accountCollection.insertOne(params)
		const accountData = await accountCollection.findOne<WithId<AccountModel>>(result.insertedId)
		const account = idMapper(accountData)
		return account
	}
}