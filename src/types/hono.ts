import { PrismaClient } from '../generated/prisma/edge'

export type Bindings = {
  DATABASE_URL: string
  JWT_SECRET: string
}

export type Variables = {
  userId: string
  prisma: PrismaClient
}

export type HonoEnv = {
  Bindings: Bindings
  Variables: Variables
}
