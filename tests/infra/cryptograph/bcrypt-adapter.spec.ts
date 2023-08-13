import { BcryptAdapter } from "@/infra/cryptograph"
import * as bcrypt from 'bcrypt'

jest.mock('bcrypt', () => ({
	hash: jest.fn((value, salt) => Promise.resolve(`hashed_value`)),
}));


const makeSut = () => {
	const salt = 12
	const sut = new BcryptAdapter(salt)
	return { sut, salt }
}
describe('Bcrypt Adapter', () => {
	test('Should call bcrypt with correct value', async () => {
		const { sut, salt } = makeSut()
		const hashSpy = jest.spyOn(bcrypt, 'hash')
		await sut.encrypt('any_value')
		expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
	})

	test('Should return a hash on success', async () => {
		const { sut, salt } = makeSut()
		const hash = await sut.encrypt('any_value')
		expect(hash).toEqual('hashed_value')

	})
})