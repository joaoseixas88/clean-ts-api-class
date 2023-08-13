import { BcryptAdapter } from "@/infra/cryptograph"
import * as bcrypt from 'bcrypt'

jest.mock('bcrypt', () => ({
	hash: jest.fn((value, salt) => Promise.resolve(`hashed_value`)),
}));


const salt = 12
const makeSut = () => {
	const sut = new BcryptAdapter(salt)
	return { sut }
}
describe('Bcrypt Adapter', () => {
	test('Should call bcrypt with correct value', async () => {
		const { sut } = makeSut()
		const hashSpy = jest.spyOn(bcrypt, 'hash')
		await sut.encrypt('any_value')
		expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
	})

	test('Should return a hash on success', async () => {
		const { sut } = makeSut()
		const hash = await sut.encrypt('any_value')
		expect(hash).toEqual('hashed_value')
	})
	test('Should throws if bcrypt throws', async () => {
		jest.spyOn(bcrypt, 'hash').mockImplementation((value, salt) => new Promise((res, rej) => rej(new Error())))
		const { sut } = makeSut()
		const promise = sut.encrypt('any_valye')
		await expect(promise).rejects.toThrow()
	})
})