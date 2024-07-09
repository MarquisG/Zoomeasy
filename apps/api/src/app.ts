import express, { NextFunction, Request, Response } from 'express'
import { config as dotenvConfig } from 'dotenv'
import cors from 'cors'

import { MeetingsController } from './controllers/MeetingsController'

dotenvConfig()

/* --------------------------- Set up Application --------------------------- */
const app = express();
const port = process.env.PORT ?? 3000

/**
 * Body parser
 */
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded())

/**
 * CORS
 */
app.set('trust proxy', 1)
app.use(cors({
	origin: process.env.FRONT_URL
}))


/* ----------------------------- Defines Routes ----------------------------- */
app.get('/', (_req: Request, res: Response) => {
	res.send('Hello, TypeScript Express!')
})

app.use('/meetings', MeetingsController)


/* --------------------------- Error Handling ------------------------------ */
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
	console.error(err.stack)

	return res.status(500).send('Something went wrong')
})


/* ---------------------------- Start Application ---------------------------- */
app.listen(port, () => {
	console.log(`Server running at http://localhost:${port}`)
})