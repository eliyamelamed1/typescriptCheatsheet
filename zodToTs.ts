import { z } from "zod";

const ApiSchemas = {
  get: {
    ARTICLES: {
      req: z.object({
        sendIt: z.number()
      }),
      res: z.object({
        sendIt: z.string()
      }),
    }
  },
  post: {
    SHARE: {
      req: z.object({
        sendIt: z.boolean()
      }),
      res: z.object({
        sendIt: z.boolean()
      }),
    },
    LIKE: {
      res: z.object({
        sendIt: z.boolean()
      }),
    }
  },
};

type InferZodSchema<Type> = Type extends z.ZodType<infer U> ? U : never;

type TransformApiService2<Schemas> = {
  [Method in keyof Schemas]: {
    [Endpoint in keyof Schemas[Method]]: 
      'req' extends keyof Schemas[Method][Endpoint] 
        ? (reqParams: InferZodSchema<Schemas[Method][Endpoint]['req']>, opt?: Record<string, unknown>) => {
            queryKey: any[],
            queryFn: () => Promise<InferZodSchema<Schemas[Method][Endpoint]['res']>>
          }
        : (opt?: Record<string, unknown>) => {
            queryKey: any[],
            queryFn: () => Promise<InferZodSchema<Schemas[Method][Endpoint]['res']>>
          };};}

type $ApiService2Schemas = TransformApiService2<typeof ApiSchemas>;

const ApiService2: $ApiService2Schemas = {
  get: {
    ARTICLES: ({ sendIt }) => ({
      queryKey: ['get', 'ARTICLES', sendIt],
      queryFn: () => Promise.resolve({sendIt: sendIt.toString()}), 
    })
  },
  post: {
    SHARE: ({ sendIt }) =>({
      queryKey: ['post', 'SHARE', sendIt],
      queryFn: () => Promise.resolve({ sendIt: !sendIt }), 
    }),
    LIKE: () =>({
      queryKey: ['post', 'LIKE'],
      queryFn: () => Promise.resolve({ sendIt: true }), 
    })
  }
};

ApiService2.get.ARTICLES({ sendIt:23 }).queryFn({ sendIt: 2 })



