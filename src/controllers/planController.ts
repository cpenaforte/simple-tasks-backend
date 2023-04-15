import {
  Request, Response,
} from 'express';
import { DefaultTFuncReturn } from 'i18next';
/* eslint-disable no-unused-vars */
import {
  fetchPlans,
  fetchPlanByTitle,
  fetchUserPlanByUserId,
  insertUserPlan,
  patchUserPlan,
  deactivateUserPlan,
} from '../services/planService';


export const getPlans = async (request: Request, response: Response): Promise<void> => {
  const { token } = request.body;

  await fetchPlans(
    token,
    (users: object) => response.status(200).json({
      users, hasError: false,
    }),
    (message: string | object | DefaultTFuncReturn) => response.status(403).json({
      message, hasError: true,
    }));
};

export const getPlanByTitle = async (request: Request, response: Response): Promise<void> => {
  const { title } = request.params;
  const { token } = request.body;

  await fetchPlanByTitle(
    token,
    title,
    (user: object) => response.status(200).json({
      user, hasError: false,
    }),
    (message: string | object | DefaultTFuncReturn) => response.status(403).json({
      message, hasError: true,
    }));
};

export const getUserPlanByUserId = async (request: Request, response: Response): Promise<void> => {
  const userId: number = parseInt(request.params.id);

  const {
    token,
  } = request.body;

  await fetchUserPlanByUserId(
    token,
    userId,
    (user: object) => response.status(200).json({
      user, hasError: false,
    }),
    (message: string | object | DefaultTFuncReturn) => response.status(403).json({
      message, hasError: true,
    }));
};

export const createUserPlan = async (request: Request, response: Response): Promise<void> => {
  const {
    token, plan,
  } = request.body;

  await insertUserPlan(
    token,
    plan,
    (answer: string | object | DefaultTFuncReturn) => response.status(201).json({
      message: answer, hasError: false,
    }),
    (message: string| object | DefaultTFuncReturn) => response.status(403).json({
      message, hasError: true,
    }));
};

export const updateUserPlan = async (request: Request, response: Response): Promise<void> => {
  const {
    plan, token,
  } = request.body;

  await patchUserPlan(
    token,
    plan,
    (answer: string | object | DefaultTFuncReturn) => response.status(200).json({
      message: answer, hasError: false,
    }),
    (message: string | object | DefaultTFuncReturn) => response.status(403).json({
      message, hasError: true,
    }));
};

export const deactivateUserPlanByUserId = async (request: Request, response: Response): Promise<void> => {
  const id: number = parseInt(request.params.id);
  const { token } = request.body;

  await deactivateUserPlan(
    token,
    id,
    (answer: string | object | DefaultTFuncReturn) => response.status(202).json({
      message: answer, hasError: false,
    }),
    (message: object | DefaultTFuncReturn) => response.status(403).json({
      message, hasError: true,
    }));
};