import { LogRepository } from "@/data/repositories"
import { LogControllerDecorator } from "@/main/decorators"
import { serverError, success } from "@/presentation/helpers"
import { Controller, HttpRequest, HttpResponse } from "@/presentation/protocols"

const makeFakeServerError = () => {
	const fakeError = new Error()
	fakeError.stack = 'any_error_stack'
	return serverError(fakeError)
}

const makeFakeAccount = () => ({
	name: 'any_name',
	email: 'any_email@mail.com',
	password: 'any_password',
	passwordConfirmation: 'any_password'
})

const makeFakeRequest = () => ({
	body: makeFakeAccount()
})

const makeController = (): Controller => {
	class ControllerStub implements Controller {
		handle(params: HttpRequest): Promise<HttpResponse> {
			const httpReponse = success(makeFakeAccount())
			return new Promise(res => res(httpReponse))
		}
	}
	return new ControllerStub()
}

const makeLogRepository = () => {
	class LogRepositoryStub implements LogRepository {
		log(stack: string): Promise<LogRepository.Result> {
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
		const httpRequest = makeFakeRequest()
		const handleSpy = jest.spyOn(controllerStub, 'handle')
		await sut.handle(httpRequest)
		expect(handleSpy).toHaveBeenCalledWith(httpRequest)
	})
	it('Should returns same body as injected controller', async () => {
		const { sut, controllerStub } = makeSut()
		const httpRequest = makeFakeRequest()
		const httpResponseWithoutLogger = await controllerStub.handle(httpRequest)
		const httpResponseWithLogger = await sut.handle(httpRequest)
		expect(httpResponseWithoutLogger).toEqual(httpResponseWithLogger)
	})
	it('Should call LogErrorRepository with correct error if controller returns a server error', async () => {
		const { sut, controllerStub, logRepositoryStub } = makeSut()
		jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(new Promise(resolve => resolve(makeFakeServerError())))
		const saveLogSpy = jest.spyOn(logRepositoryStub, 'log')
		const httpRequest = makeFakeRequest()
		await sut.handle(httpRequest)
		expect(saveLogSpy).toHaveBeenCalledWith('any_error_stack')
	})
})