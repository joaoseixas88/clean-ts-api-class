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
	return res.status(statusCode).json(body)
}