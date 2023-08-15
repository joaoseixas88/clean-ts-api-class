import { LogRepository } from "@/data/repositories";
import { mongoHelper } from "../helpers";
import { ObjectId, WithId } from "mongodb";

export class MongoDbLogRepository implements LogRepository {
	async log(stack: string): Promise<LogRepository.Result> {
		const logCollection = await mongoHelper.getCollection('logs')
		const logSave = await logCollection.insertOne({
			date: new Date(),
			stack
		})
		const findResult = await logCollection.findOne<WithId<LogRepository.Result>>(logSave.insertedId)
		return mongoHelper.idMapper(findResult)
	}

}