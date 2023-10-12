import {
  Request, Response,
} from 'express';
import i18n from 'i18next';
import {
  authenticateUser, checkToken,
} from '../services/loginService';

export const login = async (request: Request, response: Response): Promise<void> => {
  const {
    email, password,
  } = request.body;

  await authenticateUser(email, password, (user: object): void => {
    response.status(200).json({
      ...user, auth: true,
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
    response.setHeader('Clear-Site-Data', '"cookies", "storage"');
    response.status(200).json({
      message, error: false,
    });
  }, (message: string | object): void => {
    response.status(403).json({
      message, error: true,
    });
  });
};