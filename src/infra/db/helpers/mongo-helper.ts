import { Collection, MongoClient } from 'mongodb'

class MongoHelper {
	client: MongoClient | null
	async connect(): Promise<void> {

		this.client = await MongoClient.connect(process.env.MONGO_URL)
	}
	async disconnect(): Promise<void> {
		if (this.client) {
			this.client.close()
		}
	}

	getCollection(name: string): Collection {
		return this.client.db().collection(name)
	}

}
export const mongoHelper = new MongoHelper()