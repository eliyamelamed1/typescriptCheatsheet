import { z } from 'zod';

type ReqAndRes = {
  res: z.ZodType<any>;
  req: z.ZodType<any>;
};

type OnlyRes = {
  res: z.ZodType<any>;
};

const ApiSchemas = {
  get: {
    ARTICLES: {
      req: z.object({
        sendIt: z.number(),
      }),
      res: z.object({
        sendIt: z.string(),
      }),
    },
  },
  post: {
    SHARE: {
      req: z.object({
        sendIt: z.boolean(),
      }),
      res: z.object({
        sendIt: z.boolean(),
      }),
    },
    LIKE: {
      res: z.object({
        sendIt: z.boolean(),
      }),
    },
  },
};

type InferZodSchema<Type> = Type extends z.ZodType<infer U> ? U : never;

type TransformApiService2<Schemas> = {
  [Method in keyof Schemas]: {
    [Endpoint in keyof Schemas[Method]]: Schemas[Method][Endpoint] extends ReqAndRes
      ? (
          reqParams: InferZodSchema<Schemas[Method][Endpoint]['req']>,
          opt?: Record<string, unknown>
        ) => {
          queryKey: any[];
          queryFn: () => Promise<
            InferZodSchema<Schemas[Method][Endpoint]['res']>
          >;
        }
      : Schemas[Method][Endpoint] extends OnlyRes
        ? (opt?: Record<string, unknown>) => {
            queryKey: any[];
            queryFn: () => Promise<
              InferZodSchema<Schemas[Method][Endpoint]['res']>
            >;
          }
        : never;
  };
};

type $ApiService2Schemas = TransformApiService2<typeof ApiSchemas>;

const ApiService2: $ApiService2Schemas = {
  get: {
    ARTICLES: ({ sendIt }) => ({
      queryKey: ['get', 'ARTICLES', sendIt],
      queryFn: () => Promise.resolve({ sendIt: sendIt.toString() }),
    }),
  },
  post: {
    SHARE: ({ sendIt }) => ({
      queryKey: ['post', 'SHARE', sendIt],
      queryFn: () => Promise.resolve({ sendIt: !sendIt }),
    }),
    LIKE: () => ({
      queryKey: ['post', 'LIKE'],
      queryFn: () => Promise.resolve({ sendIt: true }),
    }),
  },
};

const a = await ApiService2.post.LIKE().queryFn()
