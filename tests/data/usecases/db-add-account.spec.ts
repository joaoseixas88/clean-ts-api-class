import { Encrypter } from "@/data/protocols"
import { AddAccountRepository } from "@/data/repositories"
import { DbAddAccount } from "@/data/usecases"
import { AccountModel } from "@/domain/models"
import { AddAccount } from "@/domain/usecases"
type SutType = {
	sut: AddAccount
	encrypterStub: Encrypter
	addAccountRepositoryStub: AddAccountRepository
}

const makeAccountData = () => ({
	name: 'valid_name',
	email: 'valid_email',
	password: 'valid_password'
})

const makeFakeAccount = () => ({
	id: 'valid_id',
	name: 'valid_name',
	email: 'valid_email',
	password: 'hashed_password'
})
const makeAddAccountRepositoryStub = () => {
	class AddAccountRepositoryStub implements AddAccountRepository {
		add(params: AddAccountRepository.Params): Promise<AccountModel> {
			return new Promise(res => res(makeFakeAccount()))
		}
	}
	return new AddAccountRepositoryStub()
}

const makeEncrypter = () => {
	class EncrypterStub implements Encrypter {
		async encrypt(value: string): Promise<string> {
			return new Promise(res => res('hashed_password'))
		}
	}
	return new EncrypterStub()
}


const makeSut = (): SutType => {
	const addAccountRepositoryStub = makeAddAccountRepositoryStub()
	const encrypterStub = makeEncrypter()
	const sut = new DbAddAccount(encrypterStub, addAccountRepositoryStub)
	return { sut, encrypterStub, addAccountRepositoryStub }
}

describe('DbAddAccount Usecase', () => {
	test('Should call Encrypter with correct password', async () => {
		const { sut, encrypterStub } = makeSut()
		const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
		await sut.add(makeAccountData())
		expect(encryptSpy).toHaveBeenCalledWith(makeAccountData().password)
	})
	test('Should throw if Encrypter throws', async () => {
		const { sut, encrypterStub } = makeSut()
		jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(new Promise((resolve, reject) => {
			reject(new Error())
		}))
		const promise = sut.add(makeAccountData())
		await expect(promise).rejects.toThrow()
	})
	test('Should call AddAccountRepository witch correct values', async () => {
		const { sut, addAccountRepositoryStub } = makeSut()
		const addAccountRepositorySpy = jest.spyOn(addAccountRepositoryStub, 'add')
		await sut.add(makeAccountData())
		expect(addAccountRepositorySpy).toHaveBeenCalledWith({
			name: 'valid_name',
			email: 'valid_email',
			password: 'hashed_password'
		})
	})
	test('Should throw if Encrypter throws', async () => {
		const { sut, addAccountRepositoryStub } = makeSut()
		jest.spyOn(addAccountRepositoryStub, 'add').mockReturnValueOnce(new Promise((resolve, reject) => {
			reject(new Error())
		}))
		const promise = sut.add(makeAccountData())
		await expect(promise).rejects.toThrow()
	})
	test('Should return an Account on success', async () => {
		const { sut } = makeSut()
		const account = await sut.add(makeAccountData())
		expect(account).toEqual(makeFakeAccount())
	})
})