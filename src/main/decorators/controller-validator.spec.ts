import { Controller, HttpRequest, HttpResponse, Validation } from "@/presentation/protocols"
import { ControllerValidator } from "./controller-validator"
import { badRequest, success } from "@/presentation/helpers"

const makeRequest = () => ({
	body: {
		name: 'any_name',
		email: 'any_mail@gmail.com',
		password: 'any_password'
	}
})

const makeSut = () => {
	class ValidationStub implements Validation {
		validate(params: any): void | Error {
			true
		}
	}
	class ControllerStub implements Controller {
		handle(params: HttpRequest): Promise<HttpResponse> {
			return new Promise(res => res(success()))
		}
	}
	const validationStub = new ValidationStub()
	const controllerStub = new ControllerStub()
	const sut = new ControllerValidator(validationStub, controllerStub)
	return { sut, validationStub, controllerStub }
}

describe('ControllerValidator', () => {
	it('Should return an error if validation fails', async () => {
		const { sut, validationStub } = makeSut()
		jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error())
		const httpResponse = await sut.handle(makeRequest())
		expect(httpResponse).toEqual(badRequest(new Error()))
	})
	it('Should calls controller handle method with correct values', async () => {
		const { sut, controllerStub } = makeSut()
		const handleSpy = jest.spyOn(controllerStub, 'handle')
		await sut.handle(makeRequest())
		expect(handleSpy).toHaveBeenCalledWith(makeRequest())
	})
	it('Should return same httpResponse as its controller', async () => {
		const { sut } = makeSut()
		const httpResponse = await sut.handle(makeRequest())
		expect(httpResponse).toEqual(success())
	})
})