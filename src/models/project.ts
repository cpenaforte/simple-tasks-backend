export type Project = {
    readonly project_id: number,
    readonly user_id: number,
    name: string,
    description?: string,
};

export type ReceivedProject = Omit<Project, 'project_id'>;