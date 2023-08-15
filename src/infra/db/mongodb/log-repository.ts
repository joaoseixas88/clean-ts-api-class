import { LogRepository } from "@/data/repositories";

export class MongoDbLogRepository implements LogRepository {
	save(error: Error): Promise<void> {
		throw new Error("Method not implemented.");
	}

}