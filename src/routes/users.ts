import { Hono } from 'hono'
import { sign } from 'hono/jwt'
import { signupInput, signinInput } from '@jump3rhood/medium-common'
import bcrypt from 'bcryptjs'
import type { HonoEnv } from '../types/hono'

const userRouter = new Hono<HonoEnv>()

userRouter.post('/signup', async (c) => {
  const body = await c.req.json()
  const parsed = signupInput.safeParse(body)
  console.log(body)
  if (!parsed.success) {
    return c.json(
      {
        message: 'Inputs are incorrect',
        errors: parsed.error.flatten().fieldErrors,
      },
      411,
    )
  }

  const { email, name, password } = parsed.data
  const prisma = c.get('prisma')

  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (existingUser) {
      return c.json(
        {
          error: 'Account with the email already exists. Sign In instead!',
        },
        400,
      )
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    })
    const jwt = await sign({ id: user.id }, c.env.JWT_SECRET)
    return c.json({ jwt })
  } catch (e) {
    console.log(e)
    return c.json({ error: 'Error while signing up' }, 500)
  }
})

userRouter.post('/signin', async (c) => {
  const body = await c.req.json()
  const parsed = signinInput.safeParse(body)
  if (!parsed.success) {
    return c.json({
      message: 'Inputs are wrong',
      errors: parsed.error.flatten().fieldErrors,
    })
  }

  const { email, password } = parsed.data
  const prisma = c.get('prisma')

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  })

  if (!user) {
    return c.json({ error: 'Create an account first.' }, 401)
  }
  const isPasswordCorrect = bcrypt.compare(password, user.password)
  if (!isPasswordCorrect) {
    return c.json({ error: 'incorrect username/password.' }, 401)
  }
  const jwt = await sign({ id: user.id }, c.env.JWT_SECRET)
  return c.json({ jwt })
})

export { userRouter }
