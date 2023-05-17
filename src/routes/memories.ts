import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'
import { z } from 'zod'

export async function memoriesRoutes(app: FastifyInstance) {
  app.get('/memories', async () => {
    const memories = await prisma.memory.findMany({
      orderBy: {
        createdAt: 'asc',
      },
    })

    return memories.map((memory) => {
      return {
        id: memory.id,
        coverUrl: memory.coverUrl,
        excerpt: memory.content.substring(0, 115).concat('...'),
      }
    })
  })

  app.get('/memories/:id', async (request) => {
    const paramsSchema = z.object({ id: z.string().uuid() })

    const { id } = paramsSchema.parse(request.params)

    const memory = await prisma.memory.findFirstOrThrow({
      where: { id },
    })

    return memory
  })

  app.post('/memories', async (request) => {
    const bodySchema = z.object({
      content: z.string(),
      coverUrl: z.string(),
      isPublic: z.coerce.boolean().default(false),
    })

    const { content, coverUrl, isPublic } = bodySchema.parse(request.body)

    const memory = await prisma.memory.create({
      data: {
        userId: 'af52ed22-7f77-4597-8db6-875e0f8f2242',
        content,
        coverUrl,
        isPublic,
      },
    })

    return memory
  })

  app.put('/memories/:id', async (request) => {
    const paramsSchema = z.object({ id: z.string().uuid() })

    const { id } = paramsSchema.parse(request.params)

    const bodySchema = z.object({
      content: z.string(),
      coverUrl: z.string(),
      isPublic: z.coerce.boolean().default(false),
    })

    const { content, coverUrl, isPublic } = bodySchema.parse(request.body)

    const memory = await prisma.memory.update({
      where: { id },
      data: {
        userId: 'af52ed22-7f77-4597-8db6-875e0f8f2242',
        content,
        coverUrl,
        isPublic,
      },
    })

    return memory
  })

  app.delete('/memories/:id', async (request) => {
    const paramsSchema = z.object({ id: z.string().uuid() })

    const { id } = paramsSchema.parse(request.params)

    await prisma.memory.delete({
      where: { id },
    })
  })
}
