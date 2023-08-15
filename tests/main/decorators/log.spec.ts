import { LogControllerDecorator } from "@/main/decorators"
import { Controller, HttpRequest, HttpResponse } from "@/presentation/protocols"



const makeSut = () => {
	class ControllerStub implements Controller {
		handle(params: HttpRequest): Promise<HttpResponse> {
			// throw new Error("Method not implemented.")
			return new Promise(res => res({ statusCode: 200 }))
		}
	}
	const controllerStub = new ControllerStub()
	const sut = new LogControllerDecorator(controllerStub)
	return { sut, controllerStub }
}

describe('Log Controller Decorator', () => {
	it('Should call controller handle method', async () => {
		const { sut, controllerStub } = makeSut()
		const httpRequest = {
			name: 'any_name',
			email: 'any_email@mail.com',
			password: 'any_password',
			passwordConfirmation: 'any_password'
		}
		const controllerStubSpy = jest.spyOn(controllerStub, 'handle')
		const httpResponse = await sut.handle({ body: httpRequest })
		expect(controllerStubSpy).toBeCalled()
	})
})