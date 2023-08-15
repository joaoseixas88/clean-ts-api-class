export interface LogRepository {
	save(error: Error): Promise<void>
}