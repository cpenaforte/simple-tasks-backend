import {
  Request, Response,
} from 'express';
import { authenticateUser } from '../services/loginService';

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