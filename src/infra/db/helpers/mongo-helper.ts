import env from '@/main/config/env'
import { Collection, MongoClient, WithId } from 'mongodb'
import { config } from 'dotenv'
config()
class MongoHelper {
	client: MongoClient | null
	async connect(): Promise<void> {
		this.client = await MongoClient.connect(env.mongoUrl,

			{
				connectTimeoutMS: 5000,
				serverSelectionTimeoutMS: 5000
			})
	}
	async disconnect(): Promise<void> {
		if (this.client) {
			await this.client.close()
			this.client = null
		}
	}

	async getCollection(name: string): Promise<Collection> {
		if (!this.client) await this.connect()
		return this.client.db().collection(name)
	}
	idMapper = <T = any>(params: WithId<T>): T => {
		const data = {
			...params
		}
		delete data._id
		return {
			...data,
			id: params._id
		} as T
	}

}
export const mongoHelper = new MongoHelper()