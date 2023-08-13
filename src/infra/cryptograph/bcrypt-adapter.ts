import { Encrypter } from "@/data/protocols";
import { hash } from 'bcrypt'

export class BcryptAdapter implements Encrypter {
	constructor(
		private readonly salt: number,
	) { }
	async encrypt(plainText: string): Promise<string> {
		return await hash(plainText, this.salt)
	}
}