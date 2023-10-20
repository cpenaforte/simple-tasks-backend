import { DBUser } from './../models/user';
// PARSE

export const parseUserToSend = (dbUser : DBUser) => {
  const {
    user_id,
    full_name,
    email,
    sex,
    birthday,
  } = dbUser;

  return {
    user_id,
    full_name,
    email,
    sex,
    birthday,
  };
};