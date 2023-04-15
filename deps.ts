import { Application, Context, Status } from "https://deno.land/x/oak/mod.ts";
import { config } from "https://deno.land/x/dotenv/mod.ts";
import { oakCors } from "https://deno.land/x/cors/mod.ts";
import { RateLimiterPostgres } from "https://dev.jspm.io/rate-limiter-flexible";
import pool from "./src/config/pg.ts";


export const app = new Application;
export const dotenv = config();
export const cors = oakCors();

const rateLimit = await new RateLimiterPostgres({
  storeClient: pool,
  duration: parseInt(dotenv.MAX_REQUEST_WINDOW || '5'),
  points: parseInt(dotenv.MAX_REQUEST_LIMIT || '1'),

  tableName: 'rateLimiters',
  keyPrefix: 'general',
});

export const rateLimiter = async (ctx: Context, next: () => Promise<unknown> ) : Promise<void> => {
  await rateLimit
    .consume(ctx.request.ip)
    .then(async () => {
      await next();
    })
    .catch(() => {
      ctx.response.status= (Status.TooManyRequests)
      ctx.response.body = { message: dotenv.TOO_MANY_REQUESTS_MESSAGE };
    });
};