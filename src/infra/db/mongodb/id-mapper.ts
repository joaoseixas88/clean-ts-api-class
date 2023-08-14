import { WithId } from "mongodb"

export const idMapper = <T = any>(params: WithId<T>): T => {
	const data = {
		...params
	}
	delete data._id
	return {
		...data,
		id: params._id
	} as T
}