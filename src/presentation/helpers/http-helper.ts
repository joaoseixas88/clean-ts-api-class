import { ServerError } from "../errors";
import { HttpResponse } from "../protocols";

export const badRequest = (error: Error): HttpResponse => ({
	statusCode: 400,
	body: {
		error: error.name,
		message: error.message,
		success: false
	}
})

export const serverError = (error: Error): HttpResponse => ({
	statusCode: 500,
	body: new ServerError(error.stack)
})

export const success = (data: any): HttpResponse => ({
	statusCode: 200,
	body: data
})