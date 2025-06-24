import { Hono } from 'hono'
import type { HonoEnv } from '../types/hono'
import { createBlogInput } from '@jump3rhood/medium-common'
const blogRouter = new Hono<HonoEnv>()

blogRouter.post('', async (c) => {
  const userId = c.get('userId')
  const body = await c.req.json()
  const parsed = createBlogInput.safeParse(body)
  if (!parsed.success) {
    return c.json(
      {
        message: 'Wrong inputs',
        errors: parsed.error.flatten().fieldErrors,
      },
      411,
    )
  }
  const { title, content } = parsed.data
  try {
    const post = await c.get('prisma').post.create({
      data: {
        title,
        content,
        authorId: userId,
      },
    })
    c.status(201)
    return c.json({
      id: post.id,
    })
  } catch (e) {
    console.log(e)
    return c.json(
      {
        message: 'Something went wrong',
      },
      500,
    )
  }
})

blogRouter.put('/:id', async (c) => {
  const id = c.req.param('id')
  const body = await c.req.json()
  const parsed = createBlogInput.safeParse(body)
  if (!parsed.success) {
    return c.json(
      {
        message: 'Wrong inputs',
        errors: parsed.error.flatten().fieldErrors,
      },
      411,
    )
  }
  const { title, content } = parsed.data
  const userId = c.get('userId')
  const prisma = c.get('prisma')
  try {
    await prisma.post.update({
      where: {
        id,
        authorId: userId,
      },
      data: {
        title,
        content,
      },
    })
    return c.text('updated post')
  } catch (e) {
    console.log(e)
    return c.json(
      {
        message: 'Something went wrong',
      },
      500,
    )
  }
})

// paginate this end point
blogRouter.get('/bulk', async (c) => {
  const prisma = c.get('prisma')
  console.log('reached before db call')
  const posts = await prisma.post.findMany({
    select: {
      content: true,
      title: true,
      id: true,
      author: {
        select: { name: true },
      },
    },
  })
  console.log(posts.length)
  console.log('reached after db call')

  return c.json(posts)
})
blogRouter.get('/:id', async (c) => {
  const id = c.req.param('id')

  const prisma = c.get('prisma')
  const post = await prisma.post.findUnique({
    where: {
      id,
    },
    select: {
      content: true,
      title: true,
      id: true,
      author: {
        select: { name: true },
      },
    },
  })
  return c.json(post)
})

export { blogRouter }
