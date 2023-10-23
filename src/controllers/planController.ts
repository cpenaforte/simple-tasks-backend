import {
    Request, Response,
} from 'express';
import i18n from 'i18next';
/* eslint-disable no-unused-vars */
import {
    fetchPlans,
    fetchPlanByTitle,
    fetchUserPlanByUserId,
    insertUserPlan,
    patchUserPlan,
    deactivateUserPlan,
} from '../services/planService';
import { isUserPlan } from '../utils/typeCheck';
import {
    Plan, UserPlan,
} from '../models/plan';


export const getPlans = async (request: Request, response: Response): Promise<void> => {
    const { token } = request.headers;
    if (typeof token !== 'string') {
        response.status(404).json({
            message: i18n.t('TOKEN.NOT_FOUND'), hasError: true,
        });

        return;
    }

    await fetchPlans(
        token,
        (plans: Plan[]) => response.status(200).json({
            plans, hasError: false,
        }),
        (message: string | object) => response.status(403).json({
            message, hasError: true,
        }));
};

export const getPlanByTitle = async (request: Request, response: Response): Promise<void> => {
    const { title } = request.params;

    const { token } = request.headers;
    if (typeof token !== 'string') {
        response.status(404).json({
            message: i18n.t('TOKEN.NOT_FOUND'), hasError: true,
        });

        return;
    }

    if (typeof title === 'string') {
        await fetchPlanByTitle(
            token,
            title,
            (plan: Plan) => response.status(200).json({
                plan, hasError: false,
            }),
            (message: string | object) => response.status(403).json({
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
        if (!userId) {
            response.status(403).json({
                message: i18n.t('USER.ID_NOT_FOUND'), hasError: true,
            });

            return;
        }

        const { token } = request.headers;
        if (typeof token !== 'string') {
            response.status(404).json({
                message: i18n.t('TOKEN.NOT_FOUND'), hasError: true,
            });

            return;
        }

        await fetchUserPlanByUserId(
            token,
            userId,
            (userPlan?: UserPlan) => {
                if (userPlan) {
                    return response.status(200).json({
                        userPlan, hasError: false,
                    });
                }
                return response.status(403).json({
                    message: i18n.t('USER_PLAN.NOT_FOUND'), hasError: true,
                });
            },
            (message: string | object) => response.status(403).json({
                message, hasError: true,
            }));
    } else {
        response.status(403).json({
            message: i18n.t('USER.INVALID_ID'), hasError: true,
        });
    }
};

export const createUserPlan = async (request: Request, response: Response): Promise<void> => {
    const { token } = request.headers;
    if (typeof token !== 'string') {
        response.status(404).json({
            message: i18n.t('TOKEN.NOT_FOUND'), hasError: true,
        });

        return;
    }

    const { plan } = request.body;
    if (!isUserPlan(plan)) {
        response.status(403).json({
            message: i18n.t('USER_PLAN.WRONG_TYPE'), hasError: true,
        });

        return;
    }

    await insertUserPlan(
        token,
        plan,
        (answer: string | object) => response.status(201).json({
            message: answer, hasError: false,
        }),
        (message: string | object) => response.status(403).json({
            message, hasError: true,
        }));
};

export const updateUserPlan = async (request: Request, response: Response): Promise<void> => {
    const { token } = request.headers;
    if (typeof token !== 'string') {
        response.status(404).json({
            message: i18n.t('TOKEN.NOT_FOUND'), hasError: true,
        });

        return;
    }

    const { plan } = request.body;
    if (!isUserPlan(plan)) {
        response.status(403).json({
            message: i18n.t('USER_PLAN.WRONG_TYPE'), hasError: true,
        });

        return;
    }

    await patchUserPlan(
        token,
        plan,
        (answer: string | object) => response.status(200).json({
            message: answer, hasError: false,
        }),
        (message: string | object) => response.status(403).json({
            message, hasError: true,
        }));
};

export const deactivateUserPlanByUserId = async (request: Request, response: Response): Promise<void> => {
    const strUserId = request.params.id;
    if (typeof strUserId === 'string') {
        const userId: number = parseInt(strUserId);
        const { token } = request.headers;
        if (typeof token !== 'string') {
            response.status(404).json({
                message: i18n.t('TOKEN.NOT_FOUND'), hasError: true,
            });

            return;
        }

        await deactivateUserPlan(
            token,
            userId,
            (answer: string | object) => response.status(202).json({
                message: answer, hasError: false,
            }),
            (message: string | object) => response.status(403).json({
                message, hasError: true,
            }));
    } else {
        response.status(403).json({
            message: i18n.t('USER.INVALID_ID'), hasError: true,
        });
    }
};