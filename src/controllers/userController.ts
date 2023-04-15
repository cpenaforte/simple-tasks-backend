import {
  Request, Response,
} from 'express';
import { DefaultTFuncReturn } from 'i18next';
/* eslint-disable no-unused-vars */
import {
  fetchUsers,
  fetchUserById,
  fetchUserByUsername,
  fetchUserByEmail,
  insertUser,
  patchUser,
  removeUserById,
} from '../services/userService';


export const getUsers = async (request: Request, response: Response): Promise<void> => {
  const { token } = request.body;

  await fetchUsers(
    token,
    (users: object) => response.status(200).json({
      users, hasError: false,
    }),
    (message: string | object | DefaultTFuncReturn) => response.status(403).json({
      message, hasError: true,
    }));
};

export const getUserById = async (request: Request, response: Response): Promise<void> => {
  const id: number = parseInt(request.params.id);
  const { token } = request.body;

  await fetchUserById(
    token,
    id,
    (user: object) => response.status(200).json({
      user, hasError: false,
    }),
    (message: string | object | DefaultTFuncReturn) => response.status(403).json({
      message, hasError: true,
    }));
};

export const getUserByUsername = async (request: Request, response: Response): Promise<void> => {
  const {
    token, username,
  } = request.body;

  await fetchUserByUsername(
    token,
    username,
    (user: object) => response.status(200).json({
      user, hasError: false,
    }),
    (message: string | object | DefaultTFuncReturn) => response.status(403).json({
      message, hasError: true,
    }));
};

export const getUserByEmail = async (request: Request, response: Response): Promise<void> => {
  const {
    email,
  } = request.body;

  await fetchUserByEmail(
    email,
    (user: object) => response.status(200).json({
      user, hasError: false,
    }),
    (message: string | object | DefaultTFuncReturn) => response.status(403).json({
      message, hasError: true,
    }));
};

export const createUser = async (request: Request, response: Response): Promise<void> => {
  const {
    user,
  } = request.body;

  await insertUser(
    user,
    (answer: string | object | DefaultTFuncReturn) => response.status(201).json({
      answer, hasError: false,
    }),
    (message: string| object | DefaultTFuncReturn) => response.status(403).json({
      message, hasError: true,
    }));
};

export const updateUser = async (request: Request, response: Response): Promise<void> => {
  const id: number = parseInt(request.params.id);
  const {
    user, token,
  } = request.body;

  await patchUser(
    token,
    id,
    user,
    (answer: string | object| DefaultTFuncReturn) => response.status(204).json({
      answer, hasError: false,
    }),
    (message: string | object| DefaultTFuncReturn) => response.status(403).json({
      message, hasError: true,
    }));
};

export const deleteUserById = async (request: Request, response: Response): Promise<void> => {
  const id: number = parseInt(request.params.id);
  const { token } = request.body;

  await removeUserById(
    token,
    id,
    (answer: string | object) => response.status(202).json({
      answer, hasError: false,
    }),
    (message: string | object) => response.status(403).json({
      message, hasError: true,
    }));
};