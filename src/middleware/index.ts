import { Context, Next } from 'hono'
import { verify } from 'hono/jwt'
import { PrismaClient } from '../generated/prisma/edge'
import { withAccelerate } from '@prisma/extension-accelerate'

const protectedRoutesMiddleware = async (c: Context, next: Next) => {
  const jwt = c.req.header('Authorization')
  console.log(jwt)
  if (!jwt) {
    c.status(403)
    return c.json({ error: 'unauthorized' })
  }
  // verify the token
  const payload = await verify(jwt, c.env.JWT_SECRET)
  if (!payload) {
    c.status(403)
    return c.json({ error: 'unauthorized' })
  }
  c.set('userId', payload.id)
  await next()
}
const setPrismaClientOnReq = async (c: Context, next: Next) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())
  c.set('prisma', prisma)
  await next()
}
export { protectedRoutesMiddleware, setPrismaClientOnReq }
