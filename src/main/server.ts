import express from "express";

const app = express()
const port = process.env.PORT || 5050

app.listen(port, () => console.log(`Listening at ${port}`))
