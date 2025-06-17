import { Hono } from 'hono'
import { sign } from 'hono/jwt'
import { PrismaClient } from '../generated/prisma/edge'

type Bindings = {
  DATABASE_URL: string
  JWT_SECRET: string
}

type Variables = {
  userId: string
  prisma: PrismaClient
}

const userRouter = new Hono<{ Bindings: Bindings; Variables: Variables }>()

userRouter.post('/signup', async (c) => {
  // add zod validations
  const body: {
    name: string
    email: string
    password: string
  } = await c.req.json()
  console.log(body)

  const prisma = c.get('prisma')
  try {
    const user = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        password: body.password,
      },
    })
    const jwt = await sign({ id: user.id }, c.env.JWT_SECRET)
    return c.json({ jwt })
  } catch (e) {
    c.status(403)
    return c.json({ error: 'Error while signing up' })
  }
})
userRouter.post('/signin', async (c) => {
  const prisma = c.get('prisma')
  const body = await c.req.json()
  const user = await prisma.user.findUnique({
    where: {
      email: body.email,
    },
  })
  if (!user) {
    c.status(403)
    return c.json({ error: 'user not found' })
  }

  const jwt = await sign({ id: user.id }, c.env.JWT_SECRET)
  return c.json(jwt)
})

export { userRouter }
