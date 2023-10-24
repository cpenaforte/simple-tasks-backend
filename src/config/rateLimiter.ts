import {
    NextFunction, Request, Response,
} from 'express';
import {
    IRateLimiterStoreNoAutoExpiryOptions, RateLimiterPostgres,
} from 'rate-limiter-flexible';
import pool from './pg';
import i18n from 'i18next';

const options: IRateLimiterStoreNoAutoExpiryOptions = {
    storeClient: pool,
    duration: parseInt(process.env.MAX_REQUEST_WINDOW || '5'),
    points: parseInt(process.env.MAX_REQUEST_LIMIT || '1'),

    tableName: 'rateLimiters',
    keyPrefix: 'general',
};

const rateLimiter: RateLimiterPostgres = new RateLimiterPostgres(options);

export default (req: Request, res: Response, next: NextFunction): void => {
    if (!req.ip) {
        return;
    }

    rateLimiter
        .consume(req.ip)
        .then(() => {
            next();
        })
        .catch(() => {
            res.status(429).json({
                message: i18n.t('WARNING.TOO_MANY_REQUESTS'), hasError: true,
            });
        });
};