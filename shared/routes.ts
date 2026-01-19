import { z } from 'zod';
import { insertRoadmapSchema, insertInterviewSchema, roadmaps, interviews } from './schema';

export const api = {
  roadmap: {
    generate: {
      method: 'POST' as const,
      path: '/api/roadmap/generate',
      input: insertRoadmapSchema,
      responses: {
        200: z.custom<typeof roadmaps.$inferSelect>(),
        400: z.object({ message: z.string() }),
      },
    },
  },
  interview: {
    start: {
      method: 'POST' as const,
      path: '/api/interview/start',
      input: insertInterviewSchema,
      responses: {
        201: z.custom<typeof interviews.$inferSelect>(),
        400: z.object({ message: z.string() }),
      },
    },
    list: {
      method: 'GET' as const,
      path: '/api/interviews',
      responses: {
        200: z.array(z.custom<typeof interviews.$inferSelect>()),
      },
    }
  },
};
