import { DBUser } from './../models/user';
// PARSE

export const parseUserToSend = (dbUser : DBUser) => {
  const {
    user_id,
    username,
    full_name,
    email,
    sex,
    birthday,
  } = dbUser;

  return {
    user_id,
    username,
    full_name,
    email,
    sex,
    birthday,
  };
};