import { MongoDbAccountRepository } from "@/infra/db"

export const makeMongoAccountRepository = () => {
	return new MongoDbAccountRepository()
}