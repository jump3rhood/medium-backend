import { Hono } from 'hono'
import { PrismaClient } from './generated/prisma/edge'

import { userRouter } from './routes/users'
import { blogRouter } from './routes/blogs'
import { protectedRoutesMiddleware, setPrismaClientOnReq } from './middleware'

type Bindings = {
  DATABASE_URL: string
  JWT_SECRET: string
}

type Variables = {
  userId: string
  prisma: PrismaClient
}

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>()

app.use('*', setPrismaClientOnReq)
app.use('/api/v1/blog/*', protectedRoutesMiddleware)

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.route('/api/v1/user', userRouter)
app.route('/api/v1/blog', blogRouter)

export default app
