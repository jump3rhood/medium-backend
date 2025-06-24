import { Hono } from 'hono'
import type { HonoEnv } from './types/hono'
import { userRouter } from './routes/users'
import { blogRouter } from './routes/blogs'
import { protectedRoutesMiddleware, setPrismaClientOnReq } from './middleware'
import { cors } from 'hono/cors'
const app = new Hono<HonoEnv>()

app.use('*', setPrismaClientOnReq)
app.use('/api/*', cors())
app.use('/api/v1/blog/*', protectedRoutesMiddleware)

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.route('/api/v1/user', userRouter)
app.route('/api/v1/blog', blogRouter)

export default app
