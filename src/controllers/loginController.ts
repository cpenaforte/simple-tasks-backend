import {
    Request, Response,
} from 'express';
import i18n from 'i18next';
import {
    authenticateUser, checkToken,
} from '../services/loginService';
import { LoginResponse } from '../models/login';

export const login = async (request: Request, response: Response): Promise<void> => {
    const {
        email, password,
    } = request.body;

    await authenticateUser(email, password, (loginResponse: LoginResponse): void => {
        response.status(200).json({
            ...loginResponse, auth: true,
        });
    }, (message: string): void => {
        response.status(403).json({
            message, auth: false,
        });
    });
};

export const logout = async (request: Request, response: Response): Promise<void> => {
    const { token } = request.headers;
    const { user_id } = request.body;

    if (typeof token !== 'string') {
        response.status(403).json({
            message: i18n.t('TOKEN.NOT_FOUND'), error: true,
        });

        return;
    }

    await checkToken(user_id, token, (message: string): void => {
        response.status(200).json({
            message, error: false,
        });
    }, (message: string): void => {
        response.status(403).json({
            message, error: true,
        });
    });
};