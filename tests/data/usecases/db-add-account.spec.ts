import { Encrypter } from "@/data/protocols"
import { DbAddAccount } from "@/data/usecases"

class EncrypterStub implements Encrypter {
	async encrypt(value: string): Promise<string> {
		return new Promise(res => res('hashed_password'))
	}
}


const makeSut = () => {
	const encrypterStub = new EncrypterStub()
	const sut = new DbAddAccount(encrypterStub)
	return { sut, encrypterStub }
}

describe('DbAddAccount Usecase', () => {
	test('Should call Encrypter with correct password', async () => {
		const { sut, encrypterStub } = makeSut()
		const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')

		const accountData = {
			name: 'valid_name',
			email: 'valid_email',
			password: 'valid_password'
		}

		await sut.add(accountData)
		expect(encryptSpy).toHaveBeenCalledWith(accountData.password)

	})
})