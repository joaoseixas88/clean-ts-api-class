export type HttpResponse<Body = any> = {
	statusCode: number
	body?: Body
}

export type HttpRequest<Body = any> = {
	body?: Body
}