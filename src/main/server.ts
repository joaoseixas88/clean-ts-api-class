import { mongoHelper } from '@/infra/db'
import app from './config/app'
import env from './config/env'

const port = env.port
mongoHelper.connect().then(() => {
	app.listen(port, () => console.log(`Listening at ${port}`))
}).catch(console.error)