import { BadRequestError } from '@/shared/errors/AppError';

export interface TagProps {
    name: string;
}

export class TagEntity {
    readonly name: string;

    private constructor(props: TagProps) {
        this.name = props.name;
    }

    static create(props: TagProps): TagEntity {
        if (!props.name) throw new BadRequestError('name is required');
        return new TagEntity(props);
    }
}


