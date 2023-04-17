/* eslint-disable @typescript-eslint/no-unused-vars */
// eslint-disable-next-line @typescript-eslint/no-var-requires

import { app, dotenv, cors, rateLimiter } from "./deps.ts";
const port = parseInt(dotenv.PORT);

// import rateLimiter from './config/rateLimiter';

// import userRoutes from './routes/userRoutes';
// import loginRoutes from './routes/loginRoutes';
// import planRoutes from './routes/planRoutes';
// import taskRoutes from './routes/taskRoutes';

// import i18next from 'i18next';
// import Backend from 'i18next-fs-backend';
// import middleware from 'i18next-http-middleware';

// import winstonLogger from './config/winston';

// import migrate from './migrations';

// Logger
app.use(async (ctx, next) => {
  await next();
  const rt = ctx.response.headers.get("X-Response-Time");
  console.log(`${ctx.request.method} ${ctx.request.url} - ${rt}`);
});

// Timing
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.response.headers.set("X-Response-Time", `${ms}ms`);
});

// Hello World!
app.use((ctx) => {
  ctx.response.body = "Hello World!";
});

app.use(cors);
app.use(rateLimiter);

await app.listen({ port });



// i18next.use(Backend).use(middleware.LanguageDetector).init({
//   backend: {
//     loadPath: 'src/locales/{{lng}}/{{ns}}.json',
//   },
//   preload: [ 'en-US', 'pt-BR' ],
//   fallbackLng: 'en-US',
//   supportedLngs: [ 'en-US', 'pt-BR' ],
// });

// app.use(
//   middleware.handle(i18next),
// );

// migrate().then(() => {
//   app.use(rateLimiter);
//   app.use(winstonLogger);

//   app.listen(port, () => {
//     console.log(i18next.t('SYSTEM.RUNNING_PORT', { port }));
//   });

//   app.get('/', (request, response) => {
//     response.json({ info: request.t('INFO') });
//   });

//   app.use('/api/v1/users', userRoutes);

//   app.use('/login', loginRoutes);

//   app.use('/api/v1/plans', planRoutes);

//   app.use('/api/v1/tasks', taskRoutes);
// });