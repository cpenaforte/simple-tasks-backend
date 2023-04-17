import {
  Request, Response,
} from 'express';
import i18n, { DefaultTFuncReturn } from 'i18next';
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

  if (typeof title === 'string') {
    await fetchPlanByTitle(
      token,
      title,
      (user: object) => response.status(200).json({
        user, hasError: false,
      }),
      (message: string | object | DefaultTFuncReturn) => response.status(403).json({
        message, hasError: true,
      }));
  } else {
    response.status(403).json({
      message: i18n.t('PLAN.INVALID_TITLE'), hasError: true,
    });
  }
};

export const getUserPlanByUserId = async (request: Request, response: Response): Promise<void> => {
  const strUserId = request.params.id;
  if (typeof strUserId === 'string') {
    const userId: number = parseInt(strUserId);

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
  } else {
    response.status(403).json({
      message: i18n.t('USER.INVALID_ID'), hasError: true,
    });
  }
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
    (message: string | object | DefaultTFuncReturn) => response.status(403).json({
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
  const strUserId = request.params.id;
  if (typeof strUserId === 'string') {
    const userId: number = parseInt(strUserId);
    const { token } = request.body;

    await deactivateUserPlan(
      token,
      userId,
      (answer: string | object | DefaultTFuncReturn) => response.status(202).json({
        message: answer, hasError: false,
      }),
      (message: object | DefaultTFuncReturn) => response.status(403).json({
        message, hasError: true,
      }));
  } else {
    response.status(403).json({
      message: i18n.t('USER.INVALID_ID'), hasError: true,
    });
  }
};