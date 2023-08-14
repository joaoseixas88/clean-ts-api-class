import { DbAddAccount } from "@/data/usecases"
import { makeBcryptAdapter, makeMongoAccountRepository } from "../infra"

export const makeAddAccountUsecase = () => {
	return new DbAddAccount(makeBcryptAdapter(), makeMongoAccountRepository())
}