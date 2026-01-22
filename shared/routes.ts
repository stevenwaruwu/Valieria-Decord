import { z } from 'zod';
import { insertProductSchema, insertOrderSchema, products, orders, shippingSchema, type ProductWithVariants } from './schema';

// ============================================
// SHARED ERROR SCHEMAS
// ============================================
export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

// ============================================
// API CONTRACT
// ============================================
export const api = {
  auth: {
    user: {
      method: 'GET' as const,
      path: '/api/auth/user',
      responses: {
        200: z.object({
          id: z.string(),
          username: z.string(),
          email: z.string().nullable(),
          firstName: z.string().nullable(),
          lastName: z.string().nullable(),
          profileImageUrl: z.string().nullable(),
        }).nullable(),
      },
    },
    login: {
      method: 'POST' as const,
      path: '/api/login',
      input: z.object({
        username: z.string(),
        password: z.string(),
      }),
      responses: {
        200: z.any(),
        401: errorSchemas.internal,
      },
    },
    register: {
      method: 'POST' as const,
      path: '/api/register',
      input: z.object({
        username: z.string(),
        password: z.string(),
        email: z.string().optional(),
      }),
      responses: {
        200: z.any(),
        400: errorSchemas.validation,
      },
    },
  },
  products: {
    list: {
      method: 'GET' as const,
      path: '/api/products',
      input: z.object({
        type: z.string().optional(),
        room: z.string().optional(),
        color: z.string().optional(),
        search: z.string().optional(),
        bestSeller: z.string().optional(),
        newArrival: z.string().optional(),
      }).optional(),
      responses: {
        200: z.array(z.custom<typeof products.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/products/:id',
      responses: {
        200: z.custom<ProductWithVariants>(),
        404: errorSchemas.notFound,
      },
    },
  },
  orders: {
    create: {
      method: 'POST' as const,
      path: '/api/orders',
      input: z.object({
        items: z.array(z.object({
          productId: z.number(),
          quantity: z.number(),
        })),
        shippingDetails: shippingSchema,
      }),
      responses: {
        201: z.custom<typeof orders.$inferSelect>(),
        400: errorSchemas.validation,
        401: errorSchemas.internal, // Unauthorized
      },
    },
  },
  shipping: {
    provinces: {
      method: 'GET' as const,
      path: '/api/shipping/provinces',
      responses: {
        200: z.array(z.object({
          province_id: z.string(),
          province: z.string(),
        })),
      },
    },
    cities: {
      method: 'GET' as const,
      path: '/api/shipping/cities/:provinceId',
      responses: {
        200: z.array(z.object({
          city_id: z.string(),
          province_id: z.string(),
          province: z.string(),
          type: z.string(),
          city_name: z.string(),
          postal_code: z.string(),
        })),
      },
    },
    cost: {
      method: 'POST' as const,
      path: '/api/shipping/cost',
      input: z.object({
        origin: z.string(),
        destination: z.string(),
        weight: z.number(),
        courier: z.string(),
      }),
      responses: {
        200: z.array(z.object({
          code: z.string(),
          name: z.string(),
          costs: z.array(z.object({
            service: z.string(),
            description: z.string(),
            cost: z.array(z.object({
              value: z.number(),
              etd: z.string(),
              note: z.string(),
            })),
          })),
        })),
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

export type Product = z.infer<typeof api.products.get.responses[200]>;
