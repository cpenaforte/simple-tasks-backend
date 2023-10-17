import {
  CreateReceivedUser, UpdateReceivedUser,
} from '../models/user';
import { ReceivedTask } from '../models/task';
import { UserPlan } from '../models/plan';
import {
  Project, ReceivedProject,
} from '../models/project';

export function isCreateReceivedUser(object: any): object is CreateReceivedUser {
  return (
    typeof object?.username === 'string'
        && typeof object?.user_password === 'string'
        && typeof object?.full_name === 'string'
        && typeof object?.sex === 'string'
        && typeof object?.birthday === 'string'
        && typeof object?.confirm_password === 'string'
  );
}

export function isUpdateReceivedUser(object: any): object is UpdateReceivedUser {
  return (
    typeof object?.username === 'string'
        && typeof object?.full_name === 'string'
        && typeof object?.sex === 'string'
        && typeof object?.birthday === 'string'
  );
}

export function isReceivedTask(object: any): object is ReceivedTask {
  return (
    typeof object?.user_id === 'number'
        && typeof object?.task_title === 'string'
        && typeof object?.creation_date === 'string'
        && typeof object?.urgency === 'string'
        && typeof object?.done === 'number'
  );
}

export function isUserPlan(object: any): object is UserPlan {
  return (
    typeof object?.user_id === 'number'
        && typeof object?.plan_id === 'number'
        && typeof object?.start_date === 'string'
  );
}

export function isProject(object: any): object is Project {
  return (
    typeof object?.project_id === 'number'
        && typeof object?.user_id === 'number'
        && typeof object?.name === 'string'
  );
}

export function isReceivedProject(object: any): object is ReceivedProject {
  return (
    typeof object?.user_id === 'number'
        && typeof object?.name === 'string'
  );
}