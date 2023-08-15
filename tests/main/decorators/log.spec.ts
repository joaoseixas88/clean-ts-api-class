import { LogControllerDecorator } from "@/main/decorators"
import { Controller, HttpRequest, HttpResponse } from "@/presentation/protocols"



const makeSut = () => {
	class ControllerStub implements Controller {
		handle(params: HttpRequest): Promise<HttpResponse> {
			const httpReponse: HttpResponse = {
				statusCode: 200,
				body: {
					name: 'any_name'
				}
			}
			return new Promise(res => res(httpReponse))
		}
	}
	const controllerStub = new ControllerStub()
	const sut = new LogControllerDecorator(controllerStub)
	return { sut, controllerStub }
}

describe('Log Controller Decorator', () => {
	it('Should call controller handle method', async () => {
		const { sut, controllerStub } = makeSut()
		const httpRequest: HttpRequest = {
			body: {
				name: 'any_name',
				email: 'any_email@mail.com',
				password: 'any_password',
				passwordConfirmation: 'any_password'
			}
		}
		const handleSpy = jest.spyOn(controllerStub, 'handle')
		await sut.handle(httpRequest)
		expect(handleSpy).toHaveBeenCalledWith(httpRequest)
	})
	it('Should returns same body as injected controller', async () => {

		const { sut, controllerStub } = makeSut()
		const httpRequest: HttpRequest = {
			body: {
				name: 'any_name',
				email: 'any_email@mail.com',
				password: 'any_password',
				passwordConfirmation: 'any_password'
			}
		}
		const httpResponseWithoutLogger = await controllerStub.handle(httpRequest)
		const httpResponseWithLogger = await sut.handle(httpRequest)
		expect(httpResponseWithoutLogger).toEqual(httpResponseWithLogger)

	})
})