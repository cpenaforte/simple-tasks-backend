/* eslint-disable @typescript-eslint/no-unused-vars */
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();
const port = +(process.env.PORT || 3000);

import express, { Application } from 'express';
import bodyParser from 'body-parser';
import corsMiddleware from './config/cors';
import rateLimiter from './config/rateLimiter';

import userRoutes from './routes/userRoutes';
import authRoutes from './routes/authRoutes';
import planRoutes from './routes/planRoutes';
import taskRoutes from './routes/taskRoutes';
import projectRoutes from './routes/projectRoutes';

import i18next from 'i18next';
import Backend from 'i18next-fs-backend';
import middleware from 'i18next-http-middleware';

import winstonLogger from './config/winston';

import migrate from './migrations';

import cluster from 'cluster';
import os from 'os';

i18next.use(Backend).use(middleware.LanguageDetector).init({
  backend: {
    loadPath: 'src/locales/{{lng}}/{{ns}}.json',
  },
  preload: [ 'en-US', 'pt-BR' ],
  fallbackLng: 'en-US',
  supportedLngs: [ 'en-US', 'pt-BR' ],
});

if (cluster.isPrimary) {
  migrate().then(() => {
    const totalCPUs = os.cpus().length;

    console.log(`Number of threads is ${totalCPUs}`);

    // Fork workers.
    for (let i = 0; i < totalCPUs; i++) {
      cluster.fork();
    }

    cluster.on('exit', (worker) => {
      console.log(`Worker ${worker.process.pid} died`);
      console.log('Forking another worker');
      cluster.fork();
    });
  });
} else {
  const app: Application = express();

  app.use(
    middleware.handle(i18next),
  );

  app.use(bodyParser.json());
  app.use(
    bodyParser.urlencoded({
      extended: true,
    }),
  );

  app.use(corsMiddleware);

  if (process.env.NODE_ENV === 'production') {
    app.use(rateLimiter);
  }
  app.use(winstonLogger);

  const { pid } = process;

  app.listen(port, () => {
    console.log(`Worker ${pid} on port ${port}`);
  });

  app.get('/', (request, response) => {
    response.json({ info: request.t('INFO') });
  });

  app.use('/api/v1/users', userRoutes);

  app.use('/auth', authRoutes);

  app.use('/api/v1/plans', planRoutes);

  app.use('/api/v1', taskRoutes);

  app.use('/api/v1', projectRoutes);
}
