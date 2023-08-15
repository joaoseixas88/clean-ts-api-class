export interface LogRepository {
	saveLog(stack: string): Promise<LogRepository.Result>
}
export namespace LogRepository {
	export type Result = {
		id: string
		date: Date
		stack: string
	}
}