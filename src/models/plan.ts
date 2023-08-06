export type Plan = {
    readonly plan_id: number;
    plan_title: string;
    task_permission: 0 | 1;
    share_permission: 0 | 1;
    cowork_permission: 0 | 1;
    readonly tasks_limit: number;
    readonly share_limit: number;
}

export type UserPlan = {
    readonly plan_id: number,
    readonly user_id: number,
    readonly start_date: Date,
    end_date?: Date
}