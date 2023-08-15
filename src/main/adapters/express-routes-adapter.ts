import { Controller, HttpRequest } from "@/presentation/protocols";
import { NextFunction, Request, Response } from "express";

export const adaptExpressRoute = (controller: Controller) => async (
	req: Request,
	res: Response,
) => {
	const httpRequest: HttpRequest = {
		body: req.body
	}
	const { statusCode, body } = await controller.handle(httpRequest)
	if (statusCode === 200) {
		return res.status(statusCode).json(body)

	} else {
		return res.status(statusCode).json({
			success: false,
			message: body.message
		})
	}
}