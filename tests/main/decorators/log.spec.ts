import { LogRepository } from "@/data/repositories"
import { LogControllerDecorator } from "@/main/decorators"
import { serverError } from "@/presentation/helpers"
import { Controller, HttpRequest, HttpResponse } from "@/presentation/protocols"


const makeController = (): Controller => {
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
	return new ControllerStub()
}

const makeLogRepository = () => {
	class LogRepositoryStub implements LogRepository {
		saveLog(stack: string): Promise<LogRepository.Result> {
			return
		}

	}
	return new LogRepositoryStub()
}

const makeSut = () => {
	const controllerStub = makeController()
	const logRepositoryStub = makeLogRepository()
	const sut = new LogControllerDecorator(controllerStub, logRepositoryStub)
	return { sut, controllerStub, logRepositoryStub }
}

describe('Log Controller Decorator', () => {
	it('Should call controller handle method with correct values', async () => {
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
	it('Should call LogErrorRepository with correct error if controller returns a server error', async () => {
		const { sut, controllerStub, logRepositoryStub } = makeSut()
		const fakeError = new Error()
		fakeError.stack = 'any_error_stack'
		jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(new Promise(resolve => resolve(serverError(fakeError))))
		const saveLogSpy = jest.spyOn(logRepositoryStub, 'saveLog')
		const httpRequest: HttpRequest = {
			body: {
				name: 'any_name',
				email: 'any_email@mail.com',
				password: 'any_password',
				passwordConfirmation: 'any_password'
			}
		}
		await sut.handle(httpRequest)

		expect(saveLogSpy).toHaveBeenCalledWith('any_error_stack')


	})
})