import { LogRepository } from "@/data/repositories";
import { mongoHelper } from "../helpers";
import { ObjectId, WithId } from "mongodb";

export class MongoDbLogRepository implements LogRepository {
	async logError(stack: string): Promise<void> {
		const logCollection = await mongoHelper.getCollection('errors')
		await logCollection.insertOne({
			date: new Date(),
			stack
		})
		return
	}

}