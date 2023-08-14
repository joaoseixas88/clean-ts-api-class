export default {
	mongoUrl: process.env.MONGO_URL || 'mongodb://root:root@localhost:27017/',
	port: parseInt(process.env.PORT) || 5050
}