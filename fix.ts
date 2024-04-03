import { z } from "zod";

const ApiSchemas = {
  get: {
    STONES: {
      req: z.object({
        sendIt: z.number()
      }),
      res: z.object({
        sendIt: z.string()
      }),
    }
  },
  post: {
    NOW: {
      req: z.object({
        sendIt: z.boolean()
      }),
      res: z.object({
        sendIt: z.boolean()
      }),
    },
    NOW2: {
      req: z.undefined(),
      res: z.object({
        sendIt: z.boolean()
      }),
    }
  },
};

type InferZodSchema<Type> = Type extends z.ZodType<infer U> ? U : never;


type TransformApiService2<Schemas> = {
  [Method in keyof Schemas]: {
    [Endpoint in keyof Schemas[Method]]: (reqParams: InferZodSchema<Schemas[Method][Endpoint]['req']>, opt?: Record<string, unknown>) => {
      queryKey: any[],
      queryFn: () => Promise<InferZodSchema<Schemas[Method][Endpoint]['res']>>
    }
  }
};


type $ApiService2Schemas = TransformApiService2<typeof ApiSchemas>;

const ApiService2: $ApiService2Schemas = {
  get: {
    STONES: ({ sendIt }) => ({
      queryKey: ['asd',23],
      queryFn: () => Promise.resolve({sendIt: sendIt.toString()}), 
    })
  },
  post: {
    NOW: ({ sendIt }) =>({
      queryKey: ['asd',23],
      queryFn: () => Promise.resolve({sendIt: !sendIt}), 
    }),
    NOW2: () =>({
      queryKey: ['asd',23],
      queryFn: () => Promise.resolve({sendIt: true}), 
    })
  }
};


const a = await ApiService2.post.NOW2(undefined).queryFn()


