import { Hono } from 'hono'
import { PrismaClient } from '../generated/prisma/edge'

type Bindings = {
  DATABASE_URL: string
  JWT_SECRET: string
}

type Variables = {
  userId: string
  prisma: PrismaClient
}

const blogRouter = new Hono<{ Bindings: Bindings; Variables: Variables }>()

blogRouter.post('/api/v1/blog', (c) => {
  console.log(c.get('userId'))
  return c.text('post a blog')
})
blogRouter.put('/api/v1/blog/:id', (c) => {
  return c.text('update a blog')
})
blogRouter.get('/api/v1/blog/:id', (c) => {
  const id = c.req.param('id')
  console.log(id)
  return c.text('get blog route')
})
blogRouter.get('/api/v1/blog/bulk', (c) => {
  return c.text('all blogs')
})

export {blogRouter}