import {
    Request, Response,
} from 'express';
import i18n from 'i18next';
/* eslint-disable no-unused-vars */
import {
    fetchUsers,
    fetchUserById,
    fetchUserByEmail,
    insertUser,
    patchUser,
    removeUserById,
} from '../services/userService';
import {
    User,
    UserToSend,
} from '../models/user';
import {
    isCreateReceivedUser, isUpdateReceivedUser,
} from '../utils/typeCheck';


export const getUsers = async (request: Request, response: Response): Promise<void> => {
    const { token } = request.headers;
    if (typeof token !== 'string') {
        response.status(404).json({
            message: i18n.t('TOKEN.NOT_FOUND'), hasError: true,
        });

        return;
    }

    await fetchUsers(
        token,
        (users: UserToSend[]) => response.status(200).json({
            users, hasError: false,
        }),
        (message: string) => response.status(403).json({
            message, hasError: true,
        }));
};

export const getUserById = async (request: Request, response: Response): Promise<void> => {
    const strUserId = request.params.id;
    if (typeof strUserId === 'string') {
        const id: number = parseInt(strUserId);
        const { token } = request.headers;
        if (typeof token !== 'string') {
            response.status(404).json({
                message: i18n.t('TOKEN.NOT_FOUND'), hasError: true,
            });

            return;
        }

        await fetchUserById(
            token,
            id,
            (user: UserToSend | undefined) => {
                if (user) {
                    return response.status(200).json({
                        user, hasError: false,
                    });
                }
                return response.status(403).json({
                    message: i18n.t('USER.ID_NOT_FOUND'), hasError: true,
                });
            },
            (message: string) => response.status(403).json({
                message, hasError: true,
            }));
    } else {
        response.status(403).json({
            message: i18n.t('USER.INVALID_ID'), hasError: true,
        });
    }
};

export const getUserByEmail = async (request: Request, response: Response): Promise<void> => {
    const {
        email,
    } = request.body;

    await fetchUserByEmail(
        email,
        (user: User | undefined) => {
            if (user) {
                return response.status(200).json({
                    user, hasError: false,
                });
            }
            return response.status(403).json({
                message: i18n.t('USER.NOT_FOUND'), hasError: true,
            });
        },
        (message: string) => response.status(403).json({
            message, hasError: true,
        }));
};

export const createUser = async (request: Request, response: Response): Promise<void> => {
    const {
        user,
    } = request.body;

    if (!isCreateReceivedUser(user)) {
        response.status(403).json({
            message: i18n.t('USER.WRONG_TYPE'), hasError: true,
        });

        return;
    }

    await insertUser(
        user,
        (message: string) => response.status(201).json({
            message, hasError: false,
        }),
        (message: string) => response.status(403).json({
            message, hasError: true,
        }));
};

export const updateUser = async (request: Request, response: Response): Promise<void> => {
    const strUserId = request.params.id;
    if (typeof strUserId === 'string') {
        const id: number = parseInt(strUserId);

        const { token } = request.headers;
        if (typeof token !== 'string') {
            response.status(404).json({
                message: i18n.t('TOKEN.NOT_FOUND'), hasError: true,
            });

            return;
        }

        const { user } = request.body;
        if (!isUpdateReceivedUser(user)) {
            response.status(403).json({
                message: i18n.t('USER.WRONG_TYPE'), hasError: true,
            });

            return;
        }

        await patchUser(
            token,
            id,
            user,
            (user: UserToSend) => response.status(200).json({
                user, hasError: false,
            }),
            (message: string) => response.status(403).json({
                message, hasError: true,
            }));
    } else {
        response.status(403).json({
            message: i18n.t('USER.INVALID_ID'), hasError: true,
        });
    }
};

export const deleteUserById = async (request: Request, response: Response): Promise<void> => {
    const strUserId = request.params.id;
    if (typeof strUserId === 'string') {
        const id: number = parseInt(strUserId);
        const { token } = request.headers;
        if (typeof token !== 'string') {
            response.status(404).json({
                message: i18n.t('TOKEN.NOT_FOUND'), hasError: true,
            });

            return;
        }

        await removeUserById(
            token,
            id,
            (message: string) => response.status(202).json({
                message, hasError: false,
            }),
            (message: string) => response.status(403).json({
                message, hasError: true,
            }));
    } else {
        response.status(403).json({
            message: i18n.t('USER.INVALID_ID'), hasError: true,
        });
    }
};