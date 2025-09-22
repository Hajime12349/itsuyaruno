export interface UserProps {
    id: string;
    displayName?: string;
    iconPath?: string;
    currentTask?: number;
    currentTaskTime?: string;
}

export class UserEntity {
    readonly id: string;
    displayName?: string;
    iconPath?: string;
    currentTask?: number;
    currentTaskTime?: string;

    private constructor(props: UserProps) {
        this.id = props.id;
        this.displayName = props.displayName;
        this.iconPath = props.iconPath;
        this.currentTask = props.currentTask;
        this.currentTaskTime = props.currentTaskTime;
    }

    static create(props: UserProps): UserEntity {
        if (!props.id) throw new Error('id is required');
        return new UserEntity(props);
    }
}


