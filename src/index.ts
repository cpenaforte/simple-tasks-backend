/* eslint-disable @typescript-eslint/no-unused-vars */
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();
const port = process.env.PORT;

import express, { Application } from 'express';
import bodyParser from 'body-parser';
import corsMiddleware from './config/cors';
import rateLimiter from './config/rateLimiter';

import userRoutes from './routes/userRoutes';
import loginRoutes from './routes/loginRoutes';
import planRoutes from './routes/planRoutes';
import taskRoutes from './routes/taskRoutes';

import i18next from 'i18next';
import Backend from 'i18next-fs-backend';
import middleware from 'i18next-http-middleware';

import winstonLogger from './config/winston';

import migrate from './migrations';

i18next.use(Backend).use(middleware.LanguageDetector).init({
  backend: {
    loadPath: 'src/locales/{{lng}}/{{ns}}.json',
  },
  preload: [ 'en-US', 'pt-BR' ],
  fallbackLng: 'en-US',
  supportedLngs: [ 'en-US', 'pt-BR' ],
});
const app: Application = express();

app.use(
  middleware.handle(i18next),
);

migrate().then(() => {
  app.use(bodyParser.json());
  app.use(
    bodyParser.urlencoded({
      extended: true,
    }),
  );

  app.use(corsMiddleware);
  app.use(rateLimiter);
  app.use(winstonLogger);

  app.listen(port, () => {
    console.log(i18next.t('SYSTEM.RUNNING_PORT', { port }));
  });

  app.get('/', (request, response) => {
    response.json({ info: request.t('INFO') });
  });

  app.use('/api/v1/users', userRoutes);

  app.use('/login', loginRoutes);

  app.use('/api/v1/plans', planRoutes);

  app.use('/api/v1/tasks', taskRoutes);
});