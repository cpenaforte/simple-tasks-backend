
import express, { Application } from 'express';
import bodyParser from 'body-parser';

import corsMiddleware from './config/cors';
import rateLimiter from './config/rateLimiter';
import winstonLogger from './config/winston';

import i18next from 'i18next';
import Backend from 'i18next-fs-backend';
import middleware from 'i18next-http-middleware';

import userRoutes from './routes/userRoutes';
import authRoutes from './routes/authRoutes';
import planRoutes from './routes/planRoutes';
import taskRoutes from './routes/taskRoutes';
import projectRoutes from './routes/projectRoutes';

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


app.get('/', (request, response) => {
    response.json({ info: request.t('INFO') });
});

app.use('/api/v1/users', userRoutes);

app.use('/auth', authRoutes);

app.use('/api/v1/plans', planRoutes);

app.use('/api/v1', taskRoutes);

app.use('/api/v1', projectRoutes);

export default app;