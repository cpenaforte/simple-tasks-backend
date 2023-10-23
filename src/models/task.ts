export type Task = Omit<Omit<ReceivedTask, 'creation_date'>, 'due_date'> & {
    readonly task_id: number;
    readonly user_id: number;
    readonly project_id: number;
    readonly creation_date: Date;
    readonly due_date?: Date;
    readonly urgency: Urgency;
}

export const enum Urgency {
    URGENT = 'urgent',
    IMPORTANT = 'important',
    COMMON = 'common',
}

export type ReceivedTask = {
    user_id: number;
    project_id: number;
    task_title: string;
    task_description?: string;
    creation_date: string;
    due_date?: string;
    urgency: string;
    done: 0 | 1;
}

export type TaskToSend = ReceivedTask & {
    readonly task_id: number;
}